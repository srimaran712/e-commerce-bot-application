import { Controller ,Get,Query} from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
    constructor(
        private productsService:ProductsService
    ){}

    @Get('search')
async search(
  @Query('q') query?: string,
  @Query('maxPrice') maxPrice?: string,
) {
  return this.productsService.searchProducts(
    query || '',
    maxPrice ? Number(maxPrice) : 0,
  );
}
}
