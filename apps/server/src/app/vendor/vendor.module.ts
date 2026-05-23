import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { VendorController } from './vendor.controller';
import { VendorService } from './vendor.service';

@Module({
  imports: [DatabaseModule],
  controllers: [VendorController],
  providers: [VendorService],
})
export class VendorModule {}
