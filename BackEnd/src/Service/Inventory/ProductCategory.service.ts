import { ProductCategoryModel } from '@Model/Inventory/ProductCategory.model';
import { Injectable } from '@nestjs/common';
import { product } from '@Root/Database/Table/Inventory/product';
import { product_category } from '@Root/Database/Table/Inventory/product_category';
import { CacheEnum } from '@Root/Helper/Enum/CacheEnum';
import { CacheService } from '../Cache.service';

@Injectable()
export class ProductCategoryService {
  constructor(
    private _CacheService: CacheService

  ) { }

  async GetAll() {
    const ResultData = await this._CacheService.Get(`${CacheEnum.ProductCategory}:*`);
    if (ResultData.length > 0) {
      return ResultData
    }
    else {
      const ProductCategoryList = await product_category.find();
      await this._CacheService.Store(`${CacheEnum.ProductCategory}`, ProductCategoryList);
      return ProductCategoryList;
    }
  }


  async GetById(productCategoryId: string) {
    const ProductCategoryData = await product_category.findOne({ where: { id: productCategoryId } });
    if (!ProductCategoryData) {
      throw new Error('Product Category not found')
    }
    const ResultData = await this._CacheService.Get(`${CacheEnum.ProductCategory}:${productCategoryId}`);
    if (ResultData.length > 0) {
      return ResultData[0];
    }
    else {
      const ProductCategoryData = await product_category.findOne({ where: { id: productCategoryId } });
      await this._CacheService.Store(`${CacheEnum.ProductCategory}:${productCategoryId}`, [ProductCategoryData]);
      return ProductCategoryData;
    }
  }




  async Insert(productCategoryData: ProductCategoryModel, userId: string) {
    const NewProduct = new product();
    NewProduct.name = productCategoryData.name;
    NewProduct.created_by_id = userId;
    NewProduct.created_on = new Date();
    await product_category.insert(NewProduct);
    await this._CacheService.Store(`${CacheEnum.ProductCategory}`, [NewProduct]);
    return NewProduct;
  }

  async Update(id: string, productCategoryData: ProductCategoryModel, userId: string) {
    const ExistingProduct = await product_category.findOne({ where: { id: id } });
    if (!ExistingProduct) {
      throw new Error('Product Category not found');
    }
    ExistingProduct.name = productCategoryData.name;
    ExistingProduct.updated_by_id = userId;
    ExistingProduct.updated_on = new Date();
    await product_category.update(id, ExistingProduct);
    await this._CacheService.Store(`${CacheEnum.ProductCategory}`, [{ ...ExistingProduct, id: id }]);
    return ExistingProduct;
  }

  async Delete(id: string) {
    const productCategoryData = await product_category.findOne({ where: { id } });
    if (!productCategoryData) {
      throw new Error('Product Category not found');
    }
    await productCategoryData.remove();
    await this._CacheService.Remove(`${CacheEnum.ProductCategory}:${id}`, productCategoryData);
    return true;
  }
}
