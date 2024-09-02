import { Injectable, Logger } from '@nestjs/common';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
// import { CronJob } from 'cron';
import { Rental } from 'src/entities/Rental.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    private schedulerRegistry: SchedulerRegistry,
    @InjectRepository(Rental)
    private rentalRepository: Repository<Rental>,
  ) {}

  @Cron('0 12 * * *') // Exécute tous les jours à midi celle fonction sert juste pour tester puisque je defini automatiquement un minimum de 7 jours de location si on me rentre une date inferieur.
  async sendNotificationForRentals7dayBefore() {
    this.logger.debug('Vérification des locations pour les notifications...');
    await this.sendNotifications(7);
    this.logger.log('Notifications planifiées.');
  }

  @Cron('0 12 * * *') // Exécute tous les jours à midi
  async sendNotificationForRentals5dayBefore() {
    this.logger.debug('Vérification des locations pour les notifications...');
    await this.sendNotifications(5);
    this.logger.log('Notifications planifiées.');
  }

  @Cron('0 12 * * *') // Exécute tous les jours à midi definir un intervalle par rapport a la premier cron
  async sendNotificationForRentals3dayBefore() {
    this.logger.debug('Vérification des locations pour les notifications...');
    await this.sendNotifications(3);
    this.logger.log('Notifications planifiées.');
  }

  runTaskManually() {
    this.sendNotificationForRentals7dayBefore();
    this.sendNotificationForRentals5dayBefore();
    this.sendNotificationForRentals3dayBefore();
  }

  //Fonction pour recupéré tous les rental a j-5 ou j-3 ou peu importe jour j voulu a mettre en paramètre//
  private getRentalsByDayBeforeLimitOF(
    numberOfDayBeforLimit: number,
  ): Promise<Rental[]> {
    this.logger.debug(
      'Exécution de la requête pour récupérer les locations...',
    );
    return this.rentalRepository
      .createQueryBuilder('rental')
      .leftJoinAndSelect('rental.customer', 'customer')
      .where('rental.return_date > NOW()')
      .andWhere(
        `rental.return_date <= NOW() + INTERVAL '${numberOfDayBeforLimit} days'`,
      )
      .getMany();
  }

  async sendNotifications(numberOfDayBeforLimit: number) {
    this.logger.debug('Récupération des locations à notifier...');
    const rentals = await this.getRentalsByDayBeforeLimitOF(
      numberOfDayBeforLimit,
    );
    this.logger.debug(`Nombre de locations à notifier: ${rentals.length}`);
    rentals.forEach((rental) => {
      const email = rental.customer?.email;
      if (!email) {
        this.logger.warn(
          `Email manquant pour la location ID: ${rental.rental_id}`,
        );
        return;
      }
      const returnDate = new Date(rental.return_date);
      this.logger.debug(
        `Date de retour pour la location ${rental.rental_id}: ${returnDate.toUTCString()}`,
      );
      this.logger.verbose(
        `@mail envoyé à <${email}> :Objet - Il vous reste seulement ${numberOfDayBeforLimit} jours avant de devoir rendre votre location.`,
      );
    });
  }

  listOfPlanningTasks() {
    const cronJobs = this.schedulerRegistry.getCronJobs();
    const result: {
      [key: string]: { nextExecution: string; cronPattern: string };
    } = {};
    cronJobs.forEach((job, key) => {
      let next: string;
      try {
        next = job.nextDates().toLocaleString();
      } catch (e) {
        next = 'Error: next fire date is in the past!';
      }
      result[key] = {
        nextExecution: next,
        cronPattern: job.cronTime.toString(),
      };
      this.logger.log('------------------------');
      this.logger.log(`Task n°:${key}`);
      this.logger.log(`Next execution:${next}`);
      this.logger.log(`Cron pattern:${job.cronTime.toString()}`);
      this.logger.log('------------------------');
    });
    return result;
  }

  checkTaskStatus(jobName: string): string {
    try {
      const job = this.schedulerRegistry.getCronJob(jobName);
      if (job) {
        return job.running
          ? "La tâche est en cours d'exécution."
          : "La tâche n'est pas en cours d'exécution.";
      }
      return 'Tâche non trouvée.';
    } catch (error) {
      this.logger.error(
        `Erreur lors de la vérification du statut de la tâche: ${error.message}`,
      );
      return `Aucune tâche ne porte ce nom`;
    }
  }
}
