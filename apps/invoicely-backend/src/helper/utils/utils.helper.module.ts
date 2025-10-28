import { Module } from '@nestjs/common';
import { JwtHelperService } from './jwt.helper';

@Module({
  providers: [JwtHelperService],
  exports: [JwtHelperService],
})
export class UtilsHelperModule {}
