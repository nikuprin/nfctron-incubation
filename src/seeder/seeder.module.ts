import { Module } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { DataModule } from 'src/data/data.module';

@Module({
  imports: [DataModule],
  providers: [SeederService],
})
export class SeederModule {}
