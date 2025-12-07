import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { DataModule } from './data/data.module';
import { SeederModule } from './seeder/seeder.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DB_URL'),
        ssl: true,
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
    DataModule,
    SeederModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
