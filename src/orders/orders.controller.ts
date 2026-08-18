import { Controller ,Post, Body} from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
    constructor(
        private orderService:OrdersService
    ){}

   @Post('confirm')
   confirmOrder(@Body() body:{sessionId:string}){
    return this.orderService.confirmOrder(body.sessionId)
   }
}
