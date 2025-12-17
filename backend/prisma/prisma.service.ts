/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL!, // do seu .env
    });
    console.log('DATABASE_URL =>', process.env.DATABASE_URL);

    super({ adapter }); // passa o adapter pro PrismaClient
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
