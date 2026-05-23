import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { BillController } from './bill.controller';
import { BillService } from './bill.service';

@Module({
  imports: [DatabaseModule],
  controllers: [BillController],
  providers: [BillService],
})
export class BillModule {}
