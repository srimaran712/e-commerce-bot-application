import { Injectable ,NotFoundException,BadRequestException} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Discount ,DiscountSchema} from './schemas/discounts.schema';
import { Cart } from 'src/carts/schemas/cart.schema';

@Injectable()
export class DiscountsService {
    constructor(
        @InjectModel(Discount.name)
        private discountModel:Model<Discount>,
        @InjectModel(Cart.name)
        private cartModel:Model<Cart>

    ){}

    async calculateDiscount(sessionId:string,code:string){
          let TotalAmount=0
          let DiscountAmount=0
        //check whether the code exist and is active or not 
        const isCode= await this.discountModel.findOne({
            code,
            active:true
        })

        if(!isCode){
            throw new NotFoundException('discount code is expired')
        }


        //check the cart is exist 

        const cart= await this.cartModel.findOne({sessionId})
        if(!cart){
            throw new NotFoundException('No cart found inside')
        }
      
       const  subTotal= cart.items.reduce((total,item)=>
            total + item.priceAtAdd * item.quantity
        ,0)

        const isMinCartValue=subTotal>=isCode.minCartValue
      
       if(!isMinCartValue){
        
             throw new BadRequestException(`You need to purchase on or above ${isCode.minCartValue}`)
       }

    //    if(isCode.type==='percent'){
    //      if(isCode.maxDiscount){
    //         TotalAmount=subTotal-isCode.maxDiscount
    //         DiscountAmount=isCode.maxDiscount
    //      }else{
    //         //apply with actual percent 
    //        DiscountAmount= subTotal *(isCode.value/100)
    //         TotalAmount=subTotal- DiscountAmount
    //      }
    //    }

       if (isCode.type === 'percent') {
        DiscountAmount = subTotal * (isCode.value / 100);

       if (isCode.maxDiscount !== undefined) {
       DiscountAmount = Math.min(
        DiscountAmount,
       isCode.maxDiscount,
     );
  }

  TotalAmount = subTotal - DiscountAmount;
}

       
    if (isCode.type === 'flat') {
  DiscountAmount =  Math.min(isCode.value,subTotal);
  TotalAmount = subTotal - DiscountAmount;
}
         //update discount code in the cart
         await this.cartModel.findOneAndUpdate({
            _id:cart._id
         },
         {$set:{discountCode:isCode.code}}
        )
         //if not present we can calculate based on the type 
         return {TotalAmount,DiscountAmount}
    }


    async calculateDiscountFromCode(code:string,subTotal:number){
        let DiscountAmount=0
        let TotalAmount=0
         const isCode= await this.discountModel.findOne({
            code,
            active:true
        })

        if(!isCode){
            throw new NotFoundException('discount code is expired')
        }


        const isMinCartValue=subTotal>=isCode.minCartValue
      
       if(!isMinCartValue){
        
        throw new BadRequestException(`You need to purchase on or above ${isCode.minCartValue}`)
       }

       //calculating the perentage thing
       if (isCode.type === 'percent') {
        DiscountAmount = subTotal * (isCode.value / 100);

       if (isCode.maxDiscount !== undefined) {
       DiscountAmount = Math.min(
        DiscountAmount,
       isCode.maxDiscount,
     );
  }

  TotalAmount = subTotal - DiscountAmount;
     }


     //flat calculation
    if (isCode.type === 'flat') {
    DiscountAmount =  Math.min(isCode.value,subTotal);
    TotalAmount = subTotal - DiscountAmount;
   }
   
    return {TotalAmount,DiscountAmount}

    }
}
// Does SAVE10 exist?
// Is it active?
// Is ₹10,000 ≥ the minimum cart value?
// Calculate the discount.
// Apply maxDiscount if applicable.
// Return the discount amount and final total.