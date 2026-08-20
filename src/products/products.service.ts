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

        console.log('QUERY:', query);
  console.log('MAX PRICE:', maxPrice);

        if(maxPrice!==undefined){
            filter.price={$lte:maxPrice}
        }
        //search with or operator any value present it will return
        if(query?.trim()){
            // const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            
            // filter.$or=[
            //      {   name: { $regex: escaped, $options: 'i' } },
            //      {description :{$regex:escaped, $options:'i'}},
            //      {category:{$regex:escaped,$options:'i'}}
            //     ]   ///existing logic here
            
        const words = query
      .trim()
      .split(/\s+/)
      .map((word) =>
        word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
      );
        filter.$and = words.map((word) => ({
      $or: [
        { name: { $regex: word, $options: 'i' } },
        { description: { $regex: word, $options: 'i' } },
        { category: { $regex: word, $options: 'i' } },
      ],
    }));
        }

        console.log(
    'MONGO FILTER:',
    JSON.stringify(filter, null, 2),
  );  
     const products=await this.productModel.find(filter).limit(10)
      

        return   products
    }
}
