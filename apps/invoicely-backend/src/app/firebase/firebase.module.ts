import { Global, Module } from '@nestjs/common';
import { EnvConfigModule } from '../config/config.module';
import { FirebaseService } from './firebase.service';

@Global()
@Module({
  imports: [EnvConfigModule],
  providers: [FirebaseService],
  exports: [FirebaseService],
})
export class FirebaseModule {}
