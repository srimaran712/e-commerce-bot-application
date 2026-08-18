import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product,ProductSchema } from './schemas/products.schema';
import { Model } from 'mongoose';

@Injectable()
export class ProductsService {
    constructor(
        @InjectModel(Product.name)
        private productModel:Model<Product>
    ){}

    async searchProducts(query:string,maxPrice:number){
      
        const filter:any={
            stock:{$gt:0},
            active:true
        }

        if(maxPrice!==undefined){
            filter.price={$lte:maxPrice}
        }

        if(query){
            filter.$or=[
                 {   name: { $regex: query, $options: 'i' } },
                 {description :{$regex:query, $options:'i'}},
                 {category:{$regex:query,$options:'i'}}
                ]
            
        }

        return  await this.productModel.find(filter)
    }
}
