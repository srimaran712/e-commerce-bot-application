import { Injectable,NotFoundException,BadRequestException } from '@nestjs/common';
import {InjectModel,InjectConnection} from '@nestjs/mongoose'
import {Model,Connection} from 'mongoose'
import { Order,OrderStatus } from './schemas/order.schema';
import { Cart,CartStatus } from 'src/carts/schemas/cart.schema';
import { Product } from 'src/products/schemas/products.schema';
import { DiscountsService } from 'src/discounts/discounts.service';


@Injectable()
export class OrdersService {
    constructor(
        @InjectModel(Order.name)
        private orderRepository:Model<Order>,
         @InjectModel(Cart.name)
        private cartRepository:Model<Cart>,
          @InjectModel(Product.name)
        private productRepository:Model<Product>,
        @InjectConnection()
        private connection:Connection,
        private discountService:DiscountsService
    ){}

    async confirmOrder(sessionId:string){
    
    //updating the cart with status open to avoid concurrent    
    const cart= await this.cartRepository.findOneAndUpdate(
        {
            sessionId,
            status:CartStatus.OPEN
        },
        {
          $set:{status:CartStatus.CONFIRMING}
        },
        {
            new:false
        }
    )

  if (!cart) {
    throw new NotFoundException('Open cart not found');
    }

   //starting a session
    const session= await this.connection.startSession();
    let placedOrder:any;
    try{
           
            //need to fetch the cart session
      await session.withTransaction(async ()=>{
           //iterating the items through product to check stock price change here
     for (const item of cart?.items){
       const product = await this.productRepository.findOneAndUpdate(
      {
        _id: item.productId,
        active: true,
        stock: { $gte: item.quantity },
        price: item.priceAtAdd,
      },
      {
        $inc: {
          stock: -item.quantity,
        },
      },
      {
        new: true,
      },
    ).session(session);

    if (!product) {
      throw new BadRequestException(
        'Product price or stock is no longer valid',
      );
    }

     }
     
     //calculating sub total from cart 
      const subTotal=cart.items.reduce((total,item)=>total+item.priceAtAdd*item.quantity,0)

      let discountAmount = 0;
      let totalAmount = subTotal;

      //check cart has discount code 
      if(cart.discountCode){
        const discountResult =
          await this.discountService.calculateDiscountFromCode(
            cart.discountCode,
            subTotal,
          );

        discountAmount =
          discountResult.DiscountAmount;

        totalAmount =
          discountResult.TotalAmount;
      }
    
   //creating an order here 
const [order]=  await this.orderRepository.create(
  [
    {
      orderId: `ORD-${cart._id}`,
      cartId: cart._id,
      orderItems: cart.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        actualPrice: item.priceAtAdd,
      })),
      subTotal,
      total:totalAmount,
      discountAmount:discountAmount,
      orderStatus: OrderStatus.ORDERED,
    },
  ],
  { session },
   );

  //update the cart repository

   await this.cartRepository.updateOne(
    {
      _id:cart._id
    },
    {
      $set:{status:CartStatus.PLACED}
    },
    {
      session,
    },

   )

   placedOrder = order;
      })
     
    return { success: true, order: placedOrder };
  }
  catch(err){
        await this.cartRepository.updateOne(
      {
        _id: cart._id,
        status: CartStatus.CONFIRMING,
      },
      {
        $set: {
          status: CartStatus.OPEN,
        },
      },
       );
        
      if (err instanceof BadRequestException) {
      return { success: false, error: 'STALE_PRICE_OR_STOCK', message: err.message };
    }
    throw err;
        }
        finally{
          session.endSession()
        }
           
      
      
    }
}
