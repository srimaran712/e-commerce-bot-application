import { Module } from '@nestjs/common';
import { DiscountsController } from './discounts.controller';
import { DiscountsService } from './discounts.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Discount,DiscountSchema } from './schemas/discounts.schema';

@Module({
  imports:[
    MongooseModule.forFeature([{
      name:Discount.name,
      schema:DiscountSchema
    }])
  ],
  controllers: [DiscountsController],
  providers: [DiscountsService]
})
export class DiscountsModule {}
