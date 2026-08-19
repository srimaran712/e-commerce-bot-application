import { Controller,Post,Body,Get,Query } from '@nestjs/common';
import { CartsService } from './carts.service';

@Controller('carts')
export class CartsController {
    constructor(
        private cartService:CartsService
    ){}

   @Post('items')
   addProductToCart(@Body() body:{sessionId:string,productId:string,quantity:number}){
      return this.cartService.addToCart(body.sessionId,body.productId,body.quantity)
   }

   @Post('all-items')
   addAllProductToCart(@Body() body:{sessionId:string,items:{productId:string,quantity:number}[]}){
      return this.cartService.addItemsToCart(body.sessionId,body.items)
   }

   @Get() 
   getCartDetails( @Query('sessionId') sessionId:string){
    return this.cartService.getCart(sessionId)

   }
}
