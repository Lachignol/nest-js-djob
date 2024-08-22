import { IsNotEmpty, IsString, IsNumberString } from 'class-validator';

export class CreateFilmDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsString()
  description: string;
  //   @IsOptional()
  //   @ValidateIf((o) => o.description !== undefined && o.description !== '')
  //   @IsString()
  //   description?: string;

  //   @IsOptional()
  //   @ValidateIf((o) => o.release_year !== undefined && o.release_year !== '')
  //   @IsNumberString()
  //   release_year?: string;

  @IsNumberString()
  language_id: number;

  //   @IsOptional()
  //   @ValidateIf(
  //     (o) =>
  //       o.original_language_id !== undefined && o.original_language_id !== '',
  //   )
  //   @IsNumberString()
  //   original_language_id?: number;

  //   @IsOptional()
  //   @ValidateIf((o) => o.rental_rate !== undefined && o.rental_rate !== '')
  //   @IsNumberString()
  //   rental_rate?: number;
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
