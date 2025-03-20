import { ProductModel } from '@Model/Inventory/Product.model';
import { ProductCategoryModel } from '@Model/Inventory/ProductCategory.model';
import { Injectable } from '@nestjs/common';
import { product } from '@Root/Database/Table/Inventory/product';
import { product_category } from '@Root/Database/Table/Inventory/product_category';
import { Not } from 'typeorm';

@Injectable()
export class ProductCategoryService {
  constructor() {}

  async GetAll() {
    return await product_category.find({ where: { created_by_id: Not('0') } });
  }

  async GetById(productCategoryId: string) {
    const ProductCategoryData =  await product_category.findOne({ where: { id: productCategoryId } });
    if(!ProductCategoryData){
      throw new Error('Product Category not found');
    }
    return ProductCategoryData;
  }

  async Insert(productCategoryData: ProductCategoryModel, userId: string) {
    const NewProduct = new product();
    NewProduct.name = productCategoryData.name;
    NewProduct.created_by_id = userId;
    NewProduct.created_on = new Date();

    await product_category.insert(NewProduct);
    return NewProduct;
  }

  async Update(id: string, productCategoryData: ProductCategoryModel, userId: string) {
    const ExistingProduct = await product_category.findOne({ where: { id:id } });
    if (!ExistingProduct) {
      throw new Error('Product Category not found');
    }
    ExistingProduct.name = productCategoryData.name;
    ExistingProduct.updated_by_id = userId;
    ExistingProduct.updated_on = new Date();
    await product_category.update(id, ExistingProduct);
    return ExistingProduct;
  }

  async Delete(id: string) {
    const productCategoryData = await product_category.findOne({ where: { id } });
    if (!productCategoryData) {
      throw new Error('Product Category not found');
    }
    await productCategoryData.remove();
    return true;
  }
}
