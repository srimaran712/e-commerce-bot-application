import { Injectable ,NotFoundException,BadRequestException} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Discount ,DiscountSchema} from './schemas/discounts.schema';

@Injectable()
export class DiscountsService {
    constructor(
        @InjectModel(Discount.name)
        private discountModel:Model<Discount>
    ){}

    async calculateDiscount(code:string,subTotal:number){
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
        const isMinCartValue=subTotal>=isCode.minCartValue
      
        console.log(isMinCartValue)
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
  DiscountAmount = isCode.value;
  TotalAmount = subTotal - DiscountAmount;
}
         
         //if not present we can calculate based on the type 
         return {TotalAmount,DiscountAmount}
    }
}
// Does SAVE10 exist?
// Is it active?
// Is ₹10,000 ≥ the minimum cart value?
// Calculate the discount.
// Apply maxDiscount if applicable.
// Return the discount amount and final total.