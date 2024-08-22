import { IsNotEmpty, IsNumberString, IsDateString } from 'class-validator';
// import { Transform } from 'class-transformer'

export class CreateRentalDto {
  @IsNotEmpty()
  @IsDateString()
  rental_date: Date;
  // exemple a investiguer
  // @IsOptional()
  // @IsString()
  // @MaxLength(50)
  // @Transform(({ value }) => value || 'Default Name')
  // name: string = 'Default Name';

  // @IsOptional()
  // @IsNumber()
  // @Min(0)
  // @Transform(({ value }) => {
  //   if (value === undefined || isNaN(value) || value < 0) {
  //     return 0;
  //   }
  //   return value;// })
  // age: number = 0;
  //   @Transform(({ value }) => {
  //     if (typeof value === 'string' && value.length >= 5) {
  //       return value;
  //     }
  //     return 'Default';
  //   })
  //description: string = 'Default';

  @IsNumberString()
  film_id: number;

  @IsNumberString()
  customer_id: number;

  //trouvez solution pour si pas de valeur de retour trouvé mettre un minimum de 7 jour a partir de la date actuelle
  //et si la date rentré est superieur a plus de 21 jours ne pas accepter ou je sais pas
  //return_date: Date | null;

  @IsNumberString()
  staff_id: number;
}

/*


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

 

*/
