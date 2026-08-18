import {Prop,Schema,SchemaFactory} from "@nestjs/mongoose"
import { HydratedDocument,Types } from "mongoose"
import { Cart } from "src/carts/schemas/cart.schema"

export enum OrderStatus{
    ORDERED='ordered',
    CANCELLED='cancelled',
    PENDING='pending'
}

export type OrderDocument= HydratedDocument<Order>

@Schema({_id:false})
export class OrderItems{
    @Prop({type:Types.ObjectId,ref:'Product',required:true})
    productId!:Types.ObjectId

    @Prop({required:true})
    quantity!:number

    @Prop({required:true})
    actualPrice!:number
}
export const orderItemsSchema= SchemaFactory.createForClass(OrderItems)







@Schema({timestamps:true})

export class Order{
    @Prop({required:true})
    orderId!:string

    @Prop({type:Types.ObjectId,ref:'Cart'})
    cartId!:Types.ObjectId

    @Prop({required:true})
    orderItems!:OrderItems[]

    @Prop({required:true})
    subTotal!:number

    
    @Prop({required:true})
    total!:number
     
     @Prop({required:true})
    discountAmount!:number


    @Prop({type:'enum',enum:Object.values(OrderStatus),default:OrderStatus.PENDING})
    orderStatus!:OrderStatus

}


export const OrderSchema= SchemaFactory.createForClass(Order)
