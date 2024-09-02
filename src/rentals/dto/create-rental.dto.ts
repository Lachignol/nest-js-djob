import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsDateString,
} from 'class-validator';
import { addDays } from 'date-fns';
// import { Transform } from 'class-transformer'

export class CreateRentalDto {
  @IsNotEmpty()
  @IsDateString()
  rental_date: Date;

  @IsOptional()
  @IsDateString()
  @Transform(({ value }) => {
    const currentDate = new Date();
    console.log(currentDate);
    const inputdate = new Date(value);
    const datelimit = addDays(currentDate, 21);
    const minimDate = addDays(currentDate, 7);

    if (inputdate < minimDate || !value) {
      console.log(minimDate);
      return minimDate.toISOString();
    }
    if (inputdate > datelimit) {
      console.log(datelimit);
      return datelimit.toISOString();
    }
    console.log(value);
    return value;
  })
  return_date: Date;
  // exemple a investiguer
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
