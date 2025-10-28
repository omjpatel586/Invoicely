import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { EnvConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { FirebaseModule } from './firebase/firebase.module';
import { ResponseInterceptor } from './interceptors/response.interceptor';
import { UserProfileModule } from './user-profile/user-profile.module';

@Module({
  imports: [
    EnvConfigModule,
    DatabaseModule,
    FirebaseModule,
    AuthModule,
    UserProfileModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule {}
