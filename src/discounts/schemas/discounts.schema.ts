import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export enum DiscountType{
    PERCENT='percent',
    FLAT='flat',
  
}
export type DiscountDocument = HydratedDocument<Discount>;

@Schema({timestamps:true})
export class Discount{
 
      @Prop({ required: true })
      code!:string;

      @Prop({ required: true ,enum:DiscountType})
      type!:DiscountType

      @Prop({ required: true,min:0 })
      value!:number

       @Prop({ min: 0 })
        maxDiscount?: number;

        @Prop({default:0})
        minCartValue!:number

  @Prop({ default: true })
  active!: boolean;

}

export const DiscountSchema = SchemaFactory.createForClass(Discount)