import { Controller,Body,Post } from '@nestjs/common';
import { DiscountsService } from './discounts.service';

@Controller('discounts')
export class DiscountsController {
    constructor(
     private discountService:DiscountsService
    ){}

    //calculate a discount
    @Post('calculate')
    applyDiscountCalculation(@Body() body:{code:string,subTotal:number}){
        return this.discountService.calculateDiscount(body.code,body.subTotal)
    }
}
