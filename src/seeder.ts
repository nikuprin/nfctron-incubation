import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SeederModule } from './seeder/seeder.module';
import { SeederService } from './seeder/seeder.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const seederModule = app.select(SeederModule);
  const seeder = seederModule.get(SeederService);

  await seeder.seed();
  await app.close();
}

bootstrap();
