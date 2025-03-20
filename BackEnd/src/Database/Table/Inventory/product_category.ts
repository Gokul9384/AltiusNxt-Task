import { BaseTable } from '../BaseTable';
import { Column, Entity } from 'typeorm';

@Entity()
export class product_category extends BaseTable {
  @Column({ unique: true })
  name: string;
}
