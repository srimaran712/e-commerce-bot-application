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

        const session= await this.connection.startSession()

        try{
           
            //need to fetch the cart session
      await session.startTransaction()
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
    ).session(session)
    if (!cart) {
    throw new NotFoundException('Open cart not found');
  }
     

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
     const subTotal=cart.items.reduce((total,item)=>total+item.priceAtAdd*item.quantity,0)
     const discountResult= await this.discountService.calculateDiscount(cart.sessionId,cart.discountCode)
     await this.orderRepository.create(
  [
    {
      orderId: `ORD-${Date.now()}`,
      cartId: cart._id,
      orderItems: cart.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        actualPrice: item.priceAtAdd,
      })),
      subTotal,
      total:discountResult.TotalAmount,
      discountCode: cart.discountCode,
      discountAmount:discountResult.DiscountAmount,
      orderStatus: OrderStatus.ORDERED,
    },
  ],
  { session },
);
        }
        catch{
         await session.abortTransaction()
        }finally{
          session.endSession()
        }
           
      
      
    }
}
