import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { BaseModel } from '../Base.model';

export class ProductModel extends BaseModel {

  @IsNotEmpty({ message: 'Product name is required' })
  @ApiProperty({ required: true })
  @Type(() => String)
  name: string;

  @IsNotEmpty({ message: 'Category ID is required' })
  @ApiProperty({ required: true })
  @Type(() => String)
  product_category_id: string;

  @ApiProperty({ required: false })
  @Type(() => Number)
  stock_quantity: number;

  @IsNumber({}, { message: 'Minimum quantity must be a number' })
  @ApiProperty({ required: true })
  @Type(() => Number)
  min_qty: number;

}
