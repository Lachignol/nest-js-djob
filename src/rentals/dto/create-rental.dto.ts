import { IsNotEmpty, IsNumberString, IsDateString } from 'class-validator';

export class CreateRentalDto {
  @IsNotEmpty()
  @IsDateString()
  rental_date: Date;

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
