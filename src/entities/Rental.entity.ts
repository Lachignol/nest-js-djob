import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Customer } from './Customer.entity';

@Entity()
export class Rental {
  @PrimaryGeneratedColumn()
  rental_id: number;

  @CreateDateColumn({ type: 'timestamptz' })
  rental_date: Date;

  @Column({ type: 'int' })
  film_id: number;

  @Column({ type: 'int' })
  customer_id: number;

  @Column({ type: 'timestamptz', nullable: true })
  return_date: Date | null;

  @Column({ type: 'int' })
  staff_id: number;

  @ManyToOne(() => Customer)
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  last_update: Date;
}
