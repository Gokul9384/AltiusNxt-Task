import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CurrentUser } from '@Helper/Common.helper';
import { ApiTags } from '@nestjs/swagger';
import { ResponseEnum } from '@Helper/Enum/ResponseEnum';
import { JWTAuthController } from '@Controller/JWTAuth.controller';
import { ProductCategoryService } from '@Root/Service/Inventory/ProductCategory.service';
import { ProductCategoryModel } from '@Model/Inventory/ProductCategory.model';

@Controller({ path: "ProductCategory", version: '1' })
@ApiTags("ProductCategory")
export class ProductCategoryController extends JWTAuthController {
  constructor(private _ProductCategoryService: ProductCategoryService) {
    super();
  }

  @Get('List')
  async List() {
    const ProductCategoryListData = await this._ProductCategoryService.GetAll();
    return this.SendResponseData(ProductCategoryListData);
  }

  @Get('ById/:Id')
  async ById(@Param('Id') Id: string) {
    const ProductCategoryData = await this._ProductCategoryService.GetById(Id);
    return this.SendResponseData(ProductCategoryData);
  }

  @Post('Insert')
  async Insert(@Body() ProductCategoryData: ProductCategoryModel, @CurrentUser() UserId: string) {
    await this._ProductCategoryService.Insert(ProductCategoryData, UserId);
    return this.SendResponse(ResponseEnum.Success, ResponseEnum.Created);
  }

  @Put('Update/:Id')
  async Update(@Param('Id') Id: string, @Body() ProductCategoryData: ProductCategoryModel, @CurrentUser() UserId: string) {
    await this._ProductCategoryService.Update(Id, ProductCategoryData, UserId);
    return this.SendResponse(ResponseEnum.Success, ResponseEnum.Updated);
  }

  @Delete('Delete/:Id')
  async Delete(@Param('Id') Id: string) {
    await this._ProductCategoryService.Delete(Id);
    return this.SendResponse(ResponseEnum.Success, ResponseEnum.Deleted);
  }
}
