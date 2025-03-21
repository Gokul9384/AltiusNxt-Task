import { Injectable } from '@nestjs/common';
import { product } from '@Root/Database/Table/Inventory/product';
import { product_category } from '@Root/Database/Table/Inventory/product_category';
import { CacheService } from '../Cache.service';
import { CacheEnum } from '@Root/Helper/Enum/CacheEnum';
import { Raw } from 'typeorm';

@Injectable()
export class DashboardService {
  constructor(private readonly cacheService: CacheService) { }

  async getCategoryWiseStock() {
    const cacheKey = `${CacheEnum.ProductCategoryStock}`;
    const cachedData = await this.cacheService.Get(cacheKey);
    if (cachedData.length > 0) {
      return cachedData;
    }

    const products = await product.find();
    const categories = await product_category.find();

    const CategoryWiseStock = categories.map((o) => {

      const CategoryProducts = products.filter(
        (p) => p.product_category_id === o.id
      );

      const TotalStock = CategoryProducts.reduce(
        (sum, product) => sum + Number(product.stock_quantity),
        0
      );

      return {
        id: o.id,
        categoryName: o.name,
        TotalStock,
      };
    });

    await this.cacheService.Store(cacheKey, CategoryWiseStock);

    return CategoryWiseStock;
  }




  async getLowStockProducts() {
    const LowStockProducts = await product.find({
      where: { stock_quantity: Raw(alias => `${alias} < min_qty`) }, relations: ['product_category']

    })
    return LowStockProducts;
  }

  async updateStockCache() {
    await this.cacheService.Remove(`${CacheEnum.ProductCategoryStock}`, []);
    await this.getCategoryWiseStock();
  }
}
