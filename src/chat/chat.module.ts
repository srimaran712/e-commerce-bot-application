import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ProductsModule } from 'src/products/products.module';
import { CartsModule } from 'src/carts/carts.module';
import { DiscountsModule } from 'src/discounts/discounts.module';
import { OrdersModule } from 'src/orders/orders.module';
import {MongooseModule} from '@nestjs/mongoose'
import { Conversation,ConversationSchema } from './schema/chat.schema';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports:[
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ProductsModule,
    CartsModule,
    DiscountsModule,
    OrdersModule,
    MongooseModule.forFeature([
      { name: Conversation.name, schema: ConversationSchema },
    ]),
  ],
  controllers: [ChatController],
  providers: [ChatService]
})
export class ChatModule {}
