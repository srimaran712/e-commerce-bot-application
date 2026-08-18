import { Module } from '@nestjs/common';
import { CartsController } from './carts.controller';
import { CartsService } from './carts.service';
import { MongooseModule } from '@nestjs/mongoose';
import {Cart,CartSchema} from './schemas/cart.schema'
import { ProductsModule } from 'src/products/products.module';
import { Product, ProductSchema } from 'src/products/schemas/products.schema';
@Module({
  imports:[
    MongooseModule.forFeature(
      [
        {
          name:Cart.name,
          schema:CartSchema
        },
        {
          name:Product.name,
          schema:ProductSchema
        }
      ]
    ),
    ProductsModule
  ],
  controllers: [CartsController],
  providers: [CartsService],
  exports:[CartsService]
})
export class CartsModule {}
