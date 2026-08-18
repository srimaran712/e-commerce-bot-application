import { Module } from '@nestjs/common';
import { DiscountsController } from './discounts.controller';
import { DiscountsService } from './discounts.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Discount,DiscountSchema } from './schemas/discounts.schema';
import { CartsModule } from 'src/carts/carts.module';
import {Cart, CartSchema } from 'src/carts/schemas/cart.schema';

@Module({
  imports:[
    CartsModule,
    MongooseModule.forFeature([
      {
      name:Discount.name,
      schema:DiscountSchema
    },
     {
      name:Cart.name,
      schema:CartSchema
    }
  ]),

  ],
  controllers: [DiscountsController],
  providers: [DiscountsService]
})
export class DiscountsModule {}
