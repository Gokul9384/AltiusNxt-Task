import { BaseTable } from '../BaseTable';
import { Column, Entity, ManyToOne, JoinColumn, Index } from 'typeorm';
import { product } from './product';
import { StockEntryEnum } from '@Root/Helper/Enum/StockEntryEnum';

@Entity()
export class stock_entry extends BaseTable {

  @ManyToOne(() => product, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'product_id' })
  product: product;

  @Column()
  product_id: string;

  @Column({ type: 'enum', enum: StockEntryEnum })
  stock_entry: StockEntryEnum;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  quantity: number;
}
