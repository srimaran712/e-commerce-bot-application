import { Injectable,BadRequestException,NotFoundException } from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose'
import {Model,Types} from 'mongoose'
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

  //object id check
  if (!Types.ObjectId.isValid(productId)) {
  throw new BadRequestException('Invalid product reference');
}
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

    return this.getCart(sessionId);
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
    //existingItem.priceAtAdd = product.price;
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
 await cart.save();
 return this.getCart(sessionId)
}

// async addItemsToCart(sessionId:string,items:{productId:string,quantity:number}[],){
    
//     if (!items.length) {
//   throw new BadRequestException(
//     'At least one item is required',
//   );
// }
//     for (const item of items) {
//     await this.addToCart(
//       sessionId,
//       item.productId,
//       item.quantity,
//     );
//   }

//   return this.getCart(sessionId);
// } my exisiting logic here 

async addItemsToCart(
  sessionId: string,
  items: {
    productId: string;
    quantity: number;
  }[],
) {
  if (!items.length) {
    throw new BadRequestException(
      'At least one item is required',
    );
  }

  // 1. Validate every item first
  const validatedItems :any= [];

  for (const item of items) {
    // Validate ObjectId
    if (!Types.ObjectId.isValid(item.productId)) {
      throw new BadRequestException(
        `Invalid product reference: ${item.productId}`,
      );
    }

    // Validate quantity
    if (
      !Number.isInteger(item.quantity) ||
      item.quantity <= 0
    ) {
      throw new BadRequestException(
        `Quantity must be a positive integer for product ${item.productId}`,
      );
    }

    // Find active product
    const product = await this.productModel.findOne({
      _id: item.productId,
      active: true,
    });

    if (!product) {
      throw new NotFoundException(
        `Product ${item.productId} not found or unavailable`,
      );
    }

    // Find current cart quantity for this product
    const cart = await this.cartModel.findOne({
      sessionId,
      status: CartStatus.OPEN,
    });

    const existingItem = cart?.items.find(
      (cartItem) =>
        cartItem.productId.toString() ===
        item.productId,
    );

    const newQuantity =
      (existingItem?.quantity ?? 0) + item.quantity;

    // Validate total requested quantity
    if (newQuantity > product.stock) {
      throw new BadRequestException(
        `Only ${product.stock} items are available for ${product.name}`,
      );
    }

    validatedItems.push({
      product,
      productId: item.productId,
      quantity: item.quantity,
      existingItem,
    });
  }

  // 2. All items are valid at this point.
  // Now find/create the cart and modify it.
  let cart = await this.cartModel.findOne({
    sessionId,
    status: CartStatus.OPEN,
  });

  if (!cart) {
    cart = new this.cartModel({
      sessionId,
      items: [],
      status: CartStatus.OPEN,
    });
  }

  // 3. Apply all validated items
  for (const item of validatedItems) {
    const existingItem = cart.items.find(
      (cartItem) =>
        cartItem.productId.toString() ===
        item.productId,
    );

    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      cart.items.push({
        productId: item.product._id,
        quantity: item.quantity,
        priceAtAdd: item.product.price,
      });
    }
  }

  await cart.save();

  return this.getCart(sessionId);
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
