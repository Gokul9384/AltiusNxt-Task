import { BaseTable } from '../BaseTable';
import { Column, Entity, ManyToOne, JoinColumn, Index } from 'typeorm';
import { product_category } from './product_category';

@Entity()
export class product extends BaseTable {
  @Column()
  name: string;

  @ManyToOne(() => product_category, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'user_role_id' })
  product_category: product_category;

  @Column()
  @Index()
  product_category_id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  stock_quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  min_qty: number;
}
