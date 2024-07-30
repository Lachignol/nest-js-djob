import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    const dbUser = process.env.DATABASE_USER;
    return `Database User: ${dbUser}`;
  }
}
