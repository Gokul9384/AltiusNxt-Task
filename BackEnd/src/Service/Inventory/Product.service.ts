import { ProductModel } from '@Model/Inventory/Product.model';
import { BadRequestException, Injectable } from '@nestjs/common';
import { product } from '@Root/Database/Table/Inventory/product';
import { result } from 'lodash';
import { LessThan, Not, Raw } from 'typeorm';

@Injectable()
export class ProductService {
  constructor() { }

  // Get all products
  async GetAll() {
    const ProductData = await product.find({ relations: ['product_category'] });
    return ProductData;
  }

  // Get product by ID
  async GetById(productId: string) {
    const ProductData = await product.findOne({ where: { id: productId } });
    if (!ProductData) {
      throw new Error('Product not found');
    }
    return ProductData;
  }

  // Insert a new product
  async Insert(productData: ProductModel, userId: string) {
    if (productData.stock_quantity < 0) {
      throw new BadRequestException('Stock quantity cannot be lessthan 0');
    }
    const NewProduct = new product();
    NewProduct.name = productData.name;
    NewProduct.product_category_id = productData.product_category_id;
    NewProduct.stock_quantity = productData.stock_quantity;
    NewProduct.min_qty = productData.min_qty;
    NewProduct.created_by_id = userId;
    NewProduct.created_on = new Date();

    await product.insert(NewProduct);
    return NewProduct;
  }

  // Update product
  async Update(id: string, productData: ProductModel, userId: string) {
    const ExistingProduct = await product.findOne({ where: { id: id } });
    if (!ExistingProduct) {
      throw new Error('Product not found');
    }
    if (productData.stock_quantity < 0) {
      throw new BadRequestException('Stock quantity cannot be lessthan 0');
    }
    ExistingProduct.name = productData.name;
    ExistingProduct.product_category_id = productData.product_category_id;
    ExistingProduct.stock_quantity = productData.stock_quantity;
    ExistingProduct.min_qty = productData.min_qty;
    ExistingProduct.updated_by_id = userId;
    ExistingProduct.updated_on = new Date();
    await product.update(id, ExistingProduct);
    return ExistingProduct;
  }

  // Delete product
  async Delete(id: string) {
    const productData = await product.findOne({ where: { id } });
    if (!productData) {
      throw new Error('Product not found');
    }
    await productData.remove();
    return true;
  }

  async GetLowStockProducts() {
    return await product.find({
      where: { stock_quantity: Raw(alias => `${alias} < min_qty`) }
    });
  }

}
