import { Injectable, Logger } from '@nestjs/common';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { CronJob } from 'cron';
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

  @Cron('0 0 * * *') // Exécute tous les jours à minuit
  async handleCron() {
    this.logger.debug('Vérification des locations pour les notifications...');
    await this.scheduleNotifications();
    this.logger.log('Notifications planifiées.');
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

  runTaskManually() {
    this.handleCron();
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

  async scheduleNotifications() {
    this.logger.debug('Nettoyage des anciennes notifications...');
    this.cleanupOldNotifications();
    this.logger.debug('Récupération des locations à notifier...');
    const rentals = await this.getRentalsDueForNotification();

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
        `Date de retour pour la location ${rental.rental_id}: ${returnDate}`,
      );

      const now = new Date();
      const fiveDaysBefore = new Date(returnDate);
      fiveDaysBefore.setDate(returnDate.getDate() - 5);
      fiveDaysBefore.setHours(12, 0, 0, 0); // Fixe l'heure à midi

      const threeDaysBefore = new Date(returnDate);
      threeDaysBefore.setDate(returnDate.getDate() - 3);
      threeDaysBefore.setHours(12, 0, 0, 0); // Fixe l'heure à midi

      this.logger.debug(
        `Date J-5: ${fiveDaysBefore}, Date J-3: ${threeDaysBefore}`,
      );

      if (fiveDaysBefore > now) {
        this.scheduleLogNotification(
          email,
          'Rappel de location à J-5',
          'Votre retour est prévu dans 5 jours.',
          fiveDaysBefore,
        );
      } else {
        this.logger.warn(
          `La date J-5 est déjà passée pour la location ${rental.rental_id}`,
        );
      }

      if (threeDaysBefore > now) {
        this.scheduleLogNotification(
          email,
          'Rappel de location à J-3',
          'Votre retour est prévu dans 3 jours.',
          threeDaysBefore,
        );
      } else {
        this.logger.warn(
          `La date J-3 est déjà passée pour la location ${rental.rental_id}`,
        );
      }
    });
  }

  private async getRentalsDueForNotification(): Promise<Rental[]> {
    this.logger.debug(
      'Exécution de la requête pour récupérer les locations...',
    );
    return await this.rentalRepository
      .createQueryBuilder('rental')
      .leftJoinAndSelect('rental.customer', 'customer')
      .where('rental.return_date > NOW()')
      .andWhere("rental.return_date <= NOW() + INTERVAL '5 days'")
      .getMany();
  }

  private scheduleLogNotification(
    email: string,
    subject: string,
    text: string,
    date: Date,
  ) {
    const jobName = `notify-${email}-${date.toISOString()}`;

    if (this.schedulerRegistry.doesExist('cron', jobName)) {
      this.schedulerRegistry.deleteCronJob(jobName);
      this.logger.warn(`Tâche existante supprimée: ${jobName}`);
    }

    const job = new CronJob(
      date,
      () => {
        this.logger.log(`Notification pour ${email}: ${subject} - ${text}`);
        this.schedulerRegistry.deleteCronJob(jobName);
      },
      null,
      true,
      null, // Utiliser le fuseau horaire local du client pour le job cron
    );

    try {
      this.schedulerRegistry.addCronJob(jobName, job);
      job.start();
      this.logger.log(
        `Nouvelle tâche de notification planifiée: ${jobName} pour ${date.toISOString()}`,
      );
    } catch (error) {
      this.logger.error(
        `Erreur lors de la planification de la notification: ${error.message}`,
      );
    }
  }

  private cleanupOldNotifications() {
    const jobs = this.schedulerRegistry.getCronJobs();
    jobs.forEach((job, name) => {
      if (
        name.startsWith('notify-') &&
        job.nextDate().toJSDate() < new Date()
      ) {
        this.schedulerRegistry.deleteCronJob(name);
        this.logger.log(`Ancienne tâche de notification supprimée: ${name}`);
      }
    });
  }
}
