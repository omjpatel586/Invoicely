
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  @Cron('*/14 * * * *')
  async handleCron() {
    this.logger.log('Automatic Task running');
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve({});
      }, 10000)
    });
    this.logger.log('Task Completed');
  }
}