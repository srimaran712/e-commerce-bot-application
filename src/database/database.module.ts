import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Product,ProductSchema } from 'src/products/schemas/products.schema';

@Module({
    imports:[MongooseModule.forRoot(`mongodb://localhost:27017/e-commerce`)]
})
export class DatabaseModule {
   
}
