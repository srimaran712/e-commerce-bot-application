import {Prop,Schema,SchemaFactory} from '@nestjs/mongoose'
import { HydratedDocument,Types } from 'mongoose';


export enum CartStatus {
  OPEN = 'open',
  CONFIRMING = 'confirming',
  PLACED = 'placed',
}

export type cartDocument = HydratedDocument<Cart>



@Schema({ _id: false })
export class CartItem {
  @Prop({
    type: Types.ObjectId,
    ref: 'Product',
    required: true,
  })
  productId!: Types.ObjectId;

  @Prop({
    required: true,
    min: 1,
  })
  quantity!: number;

  @Prop({
    required: true,
    min: 0,
  })
  priceAtAdd!: number;
}

export const CartItemSchema = SchemaFactory.createForClass(CartItem);





@Schema({timestamps:true})

export class Cart{
     @Prop({
    required: true,
    index: true,
  })
  sessionId!: string;

  @Prop({
    type: [CartItemSchema],
    default: [],
  })
  items!: CartItem[];

  @Prop({
    enum: Object.values(CartStatus),
    default: CartStatus.OPEN,
  })
  status!: CartStatus;

  @Prop()
  discountCode?: string;
}

export const CartSchema= SchemaFactory.createForClass(Cart)