import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CurrentUser } from '@Helper/Common.helper';
import { ApiTags } from '@nestjs/swagger';
import { JWTAuthController } from '@Controller/JWTAuth.controller';
import { ProductService } from '@Root/Service/Inventory/Product.service';
import { ProductModel } from '@Model/Inventory/Product.model';
import { ResponseEnum } from '@Root/Helper/Enum/ResponseEnum';

@Controller({ path: "Product", version: '1' })
@ApiTags("Product")
export class ProductController extends JWTAuthController {
  constructor(private _ProductService: ProductService) {
    super();
  }

  @Get('List')
  async List() {
    const ProductListData = await this._ProductService.GetAll();
    return this.SendResponseData(ProductListData);
  }

  @Get('ById/:Id')
  async ById(@Param('Id') Id: string) {
    const ProductData = await this._ProductService.GetById(Id);
    return this.SendResponseData(ProductData);
  }

  @Post('Insert')
  async Insert(@Body() ProductData: ProductModel, @CurrentUser() UserId: string) {
    await this._ProductService.Insert(ProductData, UserId);
    return this.SendResponse(ResponseEnum.Success, ResponseEnum.Created);
  }

  // @Put('Update/:Id')
  // async Update(@Param('Id') Id: string, @Body() ProductData: ProductModel, @CurrentUser() UserId: string) {
  //   await this._ProductService.Update(Id, ProductData, UserId);
  //   return this.SendResponse(ResponseEnum.Success, ResponseEnum.Updated);
  // }

  @Delete('Delete/:Id')
  async Delete(@Param('Id') Id: string) {
    await this._ProductService.Delete(Id);
    return this.SendResponse(ResponseEnum.Success, ResponseEnum.Deleted);
  }
}
