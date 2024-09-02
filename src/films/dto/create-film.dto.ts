import { IsNotEmpty, IsString, IsNumberString } from 'class-validator';

export class CreateFilmDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsNumberString()
  language_id: number;
}

/*


 @Entity()
export class Film {
  @PrimaryGeneratedColumn()
  film_id: number;
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'int', nullable: true })
  release_year: number;

  @Column({ type: 'int' })
  language_id: number;

  @Column({ type: 'int', nullable: true })
  original_language_id: number;

  @Column({ type: 'numeric', precision: 4, scale: 2, default: 4.99 })
  rental_rate: number;

  @Column({ type: 'smallint', nullable: true })
  length: number;

  @Column({ type: 'numeric', precision: 5, scale: 2, default: 19.99 })
  replacement_cost: number;

  @Column({
    type: 'enum',
    enum: ['G', 'PG', 'PG-13', 'R', 'NC-17'],
    default: 'G',
  })
  rating: string;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  last_update: Date;

  @Column({ type: 'text', array: true, nullable: true })
  special_features: string[];

  @Column({ type: 'tsvector' })
  fulltext: any;
}

*/
