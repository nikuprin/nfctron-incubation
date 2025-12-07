import { config } from 'dotenv';
import { join } from 'path';
import { DataSource } from 'typeorm';

config();

const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DB_URL,
  ssl: true,
  synchronize: false,
  entities: [join(__dirname, 'src/data/models', '*.entity.ts')],
  migrations: [join(__dirname, 'src/data/migrations', '*.ts')],
});

export default AppDataSource;
