import { StockEntryModel } from '@Model/Inventory/StockEntry.model';
import { Injectable } from '@nestjs/common';
import { product } from '@Root/Database/Table/Inventory/product';
import { stock_entry } from '@Root/Database/Table/Inventory/stock_entry';
import { StockEntryEnum } from '@Root/Helper/Enum/StockEntryEnum';
import { Not } from 'typeorm';

@Injectable()
export class StockEntryService {
  constructor() { }

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
      productExists.stock_quantity += stockEntryData.quantity;
    }
    else if (stockEntryData.type === StockEntryEnum.Outward) {
      if (productExists.stock_quantity < stockEntryData.quantity) {
        throw new Error('Insufficient stock available');
      }
      productExists.stock_quantity -= stockEntryData.quantity;
    } else {
      throw new Error('Invalid stock entry type');
    }

    await product.update(productExists.id, productExists);

    const NewStockEntry = new stock_entry();
    NewStockEntry.product_id = stockEntryData.product_id;
    NewStockEntry.stock_entry = stockEntryData.type;
    NewStockEntry.quantity = stockEntryData.quantity;
    NewStockEntry.created_by_id = userId;
    NewStockEntry.created_on = new Date();

    await stock_entry.insert(NewStockEntry);
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
