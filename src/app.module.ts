import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ProductsModule } from './products/products.module';
import { DiscountsModule } from './discounts/discounts.module';
import { CartsModule } from './carts/carts.module';
import { OrdersModule } from './orders/orders.module';
import { ChatModule } from './chat/chat.module';


@Module({
  imports: [DatabaseModule, ProductsModule, DiscountsModule, CartsModule, OrdersModule, ChatModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
