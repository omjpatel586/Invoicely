import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { UtilsHelperModule } from '../../helper/utils/utils.helper.module';
import { DatabaseModule } from '../database/database.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [UtilsHelperModule, DatabaseModule, HttpModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
