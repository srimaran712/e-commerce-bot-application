import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ProductsModule } from './products/products.module';
import { DiscountsModule } from './discounts/discounts.module';
import { CartsModule } from './carts/carts.module';


@Module({
  imports: [DatabaseModule, ProductsModule, DiscountsModule, CartsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
