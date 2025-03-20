import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { BaseModel } from '../Base.model';

export class ProductCategoryModel extends BaseModel {

  @IsNotEmpty({ message: 'Category name is required' })
  @ApiProperty({ required: true })
  @Type(() => String)
  name: string;

}
