import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CurrentUser } from '@Helper/Common.helper';
import { ApiTags } from '@nestjs/swagger';
import { ResponseEnum } from '@Helper/Enum/ResponseEnum';
import { JWTAuthController } from '@Controller/JWTAuth.controller';
import { StockEntryService } from '@Root/Service/Inventory/StockEntry.service';
import { StockEntryModel } from '@Model/Inventory/StockEntry.model';
import { StockEntryEnum } from '@Root/Helper/Enum/StockEntryEnum';

@Controller({ path: "StockEntry", version: '1' })
@ApiTags("Stock Entry")
export class StockEntryController extends JWTAuthController {
  constructor(private _StockEntryService: StockEntryService) {
    super();
  }

  @Get('List/:Id')
  async List(@Param('Id') StockEntryType: StockEntryEnum) {
    const StockEntryListData = await this._StockEntryService.GetAll(StockEntryType);
    return this.SendResponseData(StockEntryListData);
  }

  @Get('ById/:Id')
  async ById(@Param('Id') Id: string) {
    const StockEntryData = await this._StockEntryService.GetById(Id);
    return this.SendResponseData(StockEntryData);
  }

  @Post('Insert')
  async Insert(@Body() StockEntryData: StockEntryModel, @CurrentUser() UserId: string) {
    await this._StockEntryService.Insert(StockEntryData, UserId);
    return this.SendResponse(ResponseEnum.Success, ResponseEnum.Created);
  }

  @Put('Update/:Id')
  async Update(@Param('Id') Id: string, @Body() StockEntryData: StockEntryModel, @CurrentUser() UserId: string) {
    await this._StockEntryService.Update(Id, StockEntryData, UserId);
    return this.SendResponse(ResponseEnum.Success, ResponseEnum.Updated);
  }

  @Delete('Delete/:Id')
  async Delete(@Param('Id') Id: string) {
    await this._StockEntryService.Delete(Id);
    return this.SendResponse(ResponseEnum.Success, ResponseEnum.Deleted);
  }
}
