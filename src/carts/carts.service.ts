import { Injectable,BadRequestException,NotFoundException } from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose'
import {Model} from 'mongoose'
import { Cart } from './schemas/cart.schema';
import { Product } from 'src/products/schemas/products.schema';
import { CartStatus } from './schemas/cart.schema';

@Injectable()
export class CartsService {
      constructor(
        @InjectModel(Cart.name)
        private cartModel:Model<Cart>,
        @InjectModel(Product.name)
        private productModel:Model<Product>
      ){}

      async addToCart(
  sessionId: string,
  productId: string,
  quantity: number,
) {
  // 1. Validate quantity
  if (!Number.isInteger(quantity) || quantity <= 0) {
    throw new BadRequestException(
      'Quantity must be a positive integer',
    );
  }

  // 2. Find product
  const product = await this.productModel.findOne({
    _id: productId,
    active: true,
  });

  if (!product) {
    throw new NotFoundException(
      'Product not found or unavailable',
    );
  }

  // 3. Find existing cart
  let cart = await this.cartModel.findOne({
    sessionId,
    status: CartStatus.OPEN,
  });

  // 4. No cart → create one
  if (!cart) {
    if (product.stock < quantity) {
      throw new BadRequestException(
        `Only ${product.stock} items are available`,
      );
    }

    cart = await this.cartModel.create({
      sessionId,
      items: [
        {
          productId: product._id,
          quantity,
          priceAtAdd: product.price,
        },
      ],
      status: CartStatus.OPEN,
    });

    return cart;
  }

  // 5. Check whether product is already in cart
  const existingItem = cart.items.find(
    (item) => item.productId.toString() === productId,
  );

  if (existingItem) {
    const newQuantity = existingItem.quantity + quantity;

    if (newQuantity > product.stock) {
      throw new BadRequestException(
        `Only ${product.stock} items are available`,
      );
    }

    existingItem.quantity = newQuantity;

    // Keep the price snapshot current when adding more
    existingItem.priceAtAdd = product.price;
  } else {
    if (product.stock < quantity) {
      throw new BadRequestException(
        `Only ${product.stock} items are available`,
      );
    }

    cart.items.push({
      productId: product._id,
      quantity,
      priceAtAdd: product.price,
    });
  }

  return cart.save();
}



async getCart(sessionId: string) {
  const cart = await this.cartModel
    .findOne({
      sessionId,
      status: CartStatus.OPEN,
    })
    .populate('items.productId', 'name price category');

  if (!cart) {
    throw new NotFoundException('Cart not found');
  }

  const subtotal = cart.items.reduce(
    (total, item) => total + item.priceAtAdd * item.quantity,
    0,
  );

  return {
    sessionId: cart.sessionId,
    items: cart.items,
    subtotal,
    discountCode: cart.discountCode,
    status: cart.status,
  };
}
}
