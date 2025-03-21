import { Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DashboardService } from '@Root/Service/Inventory/Dashboard.service';


@Controller({ path: "Dashboard", version: '1' })
@ApiTags("Dashboard")
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) { }


  @Get('category-wise-stock')
  async getCategoryWiseStock() {
    return await this.dashboardService.getCategoryWiseStock();
  }

  @Get('low-stock-products')
  async getLowStockProducts() {
    return await this.dashboardService.getLowStockProducts();
  }

}
