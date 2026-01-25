import { Module } from '@nestjs/common';
import { UtilsHelperModule } from '../../helper/utils/utils.helper.module';
import { DatabaseModule } from '../database/database.module';
import { UserProfileController } from './user-profile.controller';
import { UserProfileService } from './user-profile.service';

@Module({
  imports: [UtilsHelperModule, DatabaseModule],
  controllers: [UserProfileController],
  providers: [UserProfileService],
})
export class UserProfileModule {}
