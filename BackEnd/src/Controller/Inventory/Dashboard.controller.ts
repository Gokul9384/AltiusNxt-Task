import { Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DashboardService } from '@Root/Service/Inventory/Dashboard.service';
import { JWTAuthController } from '../JWTAuth.controller';


@Controller({ path: "Dashboard", version: '1' })
@ApiTags("Dashboard")
export class DashboardController extends JWTAuthController {
  constructor(private readonly dashboardService: DashboardService) {
    super()
  }


  @Get('category-wise-stock')
  async getCategoryWiseStock() {
    return await this.dashboardService.getCategoryWiseStock();
  }

  @Get('low-stock-products')
  async getLowStockProducts() {
    return await this.dashboardService.getLowStockProducts();
  }

}
