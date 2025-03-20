import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsEnum, IsNumber } from 'class-validator';
import { BaseModel } from '../Base.model';
import { StockEntryEnum } from '@Root/Helper/Enum/StockEntryEnum';

export class StockEntryModel extends BaseModel {

  @IsNotEmpty({ message: 'Product ID is required' })
  @ApiProperty({ required: true })
  @Type(() => String)
  product_id: string;

  @ApiProperty({ required: false, enum: StockEntryEnum })
  @Type(() => String)
  type: StockEntryEnum;

  @IsNumber({}, { message: 'Quantity must be a number' })
  @ApiProperty({ required: true })
  @Type(() => Number)
  quantity: number;

}
