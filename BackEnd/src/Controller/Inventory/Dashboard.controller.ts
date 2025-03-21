import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DashboardService } from '@Root/Service/Inventory/Dashboard.service';


@Controller({ path: "Dashboard", version: '1' })
@ApiTags("Dashboard")
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) { }

  @Get()
  async getDashboardData() {
    return this.dashboardService.getDashboardData();
  }
}
