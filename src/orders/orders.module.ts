import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { CartsModule } from 'src/carts/carts.module';
import { DiscountsModule } from 'src/discounts/discounts.module';
import { ProductsModule } from 'src/products/products.module';
import { MongooseModule } from '@nestjs/mongoose';
import {Order,OrderSchema} from './schemas/order.schema'
import {Cart, CartSchema } from 'src/carts/schemas/cart.schema';
import { Product ,ProductSchema} from 'src/products/schemas/products.schema';


@Module({
  imports:[
    CartsModule,
    DiscountsModule,
    ProductsModule,

    MongooseModule.forFeature(
      [
        {
         name:Order.name,
         schema:OrderSchema
        },
        {
         name:Cart.name,
         schema:CartSchema
        },
        {
         name:Product.name,
         schema:ProductSchema
        },
      ]
    )
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports:[OrdersService]
})
export class OrdersModule {}
