import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Customer {
  @PrimaryGeneratedColumn()
  customer_id: number;

  @Column({ type: 'int' })
  store_id: number;

  @Column({ type: 'varchar', length: 45 })
  first_name: string;

  @Column({ type: 'varchar', length: 45 })
  last_name: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  email: string;

  @Column({ type: 'int' })
  address_id: number;

  @Column({ type: 'bool', default: true })
  activebool: boolean;

  @CreateDateColumn({ type: 'date', default: () => 'CURRENT_DATE' })
  create_date: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  last_update: Date;

  @Column({ type: 'int', nullable: true })
  active: number;

  @Column({ nullable: true, default: 'UTC' })
  timeZone: string;
}
