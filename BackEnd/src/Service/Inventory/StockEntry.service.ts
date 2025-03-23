import { StockEntryModel } from '@Model/Inventory/StockEntry.model';
import { Injectable } from '@nestjs/common';
import { product } from '@Root/Database/Table/Inventory/product';
import { stock_entry } from '@Root/Database/Table/Inventory/stock_entry';
import { StockEntryEnum } from '@Root/Helper/Enum/StockEntryEnum';
import { DashboardService } from './Dashboard.service';
import { DashboardGateway } from '../DashboardGateway.service';

@Injectable()
export class StockEntryService {
  constructor(
    private _DashboardService: DashboardService,
    private dashboardGateway: DashboardGateway
  ) { }

  async GetAll(StockEntryType: StockEntryEnum) {
    const StockEntryData = await stock_entry.find({ where: { stock_entry: StockEntryType }, relations: ["product"] });
    return StockEntryData;
  }

  async GetById(stockEntryId: string) {
    return await stock_entry.findOne({ where: { id: stockEntryId } });
  }

  async Insert(stockEntryData: StockEntryModel, userId: string) {
    const productExists = await product.findOne({ where: { id: stockEntryData.product_id } });

    if (!productExists) {
      throw new Error('Product not found');
    }

    if (stockEntryData.type === StockEntryEnum.Inward) {
      productExists.stock_quantity = Number(productExists.stock_quantity) + Number(stockEntryData.quantity);
    }

    else {
      if (Number(productExists.stock_quantity) < Number(stockEntryData.quantity)) {
        throw new Error('Insufficient stock available');
      }
      productExists.stock_quantity = Number(productExists.stock_quantity) - Number(stockEntryData.quantity);
    }


    await product.update(productExists.id, productExists);

    const NewStockEntry = new stock_entry();
    NewStockEntry.product_id = stockEntryData.product_id;
    NewStockEntry.stock_entry = stockEntryData.type;
    NewStockEntry.quantity = stockEntryData.quantity;
    NewStockEntry.created_by_id = userId;
    NewStockEntry.created_on = new Date();

    await stock_entry.insert(NewStockEntry);
    this.dashboardGateway.sendStockUpdate(NewStockEntry);
  // Emit the stock update to all connected clients
  const updatedStock = await this._DashboardService.getCategoryWiseStock();
  console.log('Updated stock data:', updatedStock); // Log the updated stock data
  this.dashboardGateway.sendStockUpdate(updatedStock);
  return NewStockEntry;
  }


  async Update(id: string, stockEntryData: StockEntryModel, userId: string) {
    const ExistingStockEntry = await stock_entry.findOne({ where: { id: id } });

    if (!ExistingStockEntry) {
      throw new Error('Stock entry not found');
    }

    ExistingStockEntry.product_id = stockEntryData.product_id;
    ExistingStockEntry.stock_entry = stockEntryData.type;
    ExistingStockEntry.quantity = stockEntryData.quantity;
    ExistingStockEntry.updated_by_id = userId;
    ExistingStockEntry.updated_on = new Date();
    await stock_entry.update(id, ExistingStockEntry);
    this._DashboardService.updateStockCache();
    return ExistingStockEntry;
  }

  async Delete(id: string) {
    const stockEntryData = await stock_entry.findOne({ where: { id } });
    if (!stockEntryData) {
      throw new Error('Stock entry not found');
    }
    await stockEntryData.remove();
    return true;
  }
}
