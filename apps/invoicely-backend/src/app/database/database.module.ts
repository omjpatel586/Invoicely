import { Logger, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { EnvConfigModule } from '../config/config.module';
import { Schemas } from './models';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [EnvConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const uri = configService.get<string>('MONGO_URI');
        const logger = new Logger('MongoDB');

        const options: MongooseModuleOptions = {
          uri,
          connectionFactory: (connection: Connection) => {
            // Attach listeners
            connection.on('connected', () => logger.log('connected'));
            connection.on('error', (err) =>
              logger.error(`connection error: ${err}`)
            );
            connection.on('disconnected', () => logger.warn('disconnected'));
            return connection;
          },
        };

        return options;
      },
    }),
    MongooseModule.forFeature(Schemas),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}
