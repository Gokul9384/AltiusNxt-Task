import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { product } from '@Root/Database/Table/Inventory/product';
import { product_category } from '@Root/Database/Table/Inventory/product_category';
import { Repository } from 'typeorm';
import { CacheService } from '../Cache.service';

@Injectable()
export class DashboardService {
  constructor(
    private readonly cacheService: CacheService,
  ) { }

  async getDashboardData() {
    const categories = await product_category.find();
    const products = await product.find();

    const categoryWiseStock = categories.map((category) => {
      const categoryProducts = products.filter(
        (product) => product.product_category_id === category.id,
      );

      // Calculate total stock and ensure it's a number
      const totalStock = categoryProducts.reduce(
        (sum, product) => sum + Number(product.stock_quantity), // Convert to number
        0, // Initial value is a number
      );

      const lowStockProducts = categoryProducts.filter(
        (product) => Number(product.stock_quantity) < Number(product.min_qty),
      );

      return {
        categoryId: category.id,
        categoryName: category.name,
        totalStock: totalStock, // Ensure this is a number
        lowStockProducts: lowStockProducts.map((product) => ({
          id: product.id,
          name: product.name,
          stockQuantity: Number(product.stock_quantity), // Convert to number
          minQty: Number(product.min_qty), // Convert to number
        })),
      };
    });

    return categoryWiseStock;
  }

  // Invalidate cache when products or stock entries are updated
  async invalidateCache() {
    await this.cacheService.Remove('dashboardData', { Type: 'D' }); // Use 'D' to indicate deletion
  }
}
