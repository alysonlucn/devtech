import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import { env } from '../config/env';
import * as entities from '../entities';

const sslConfig = env.DB_SSL ? { rejectUnauthorized: false } : false;

const connectionOptions: DataSourceOptions = env.DATABASE_URL
  ? {
      type: 'postgres',
      url: env.DATABASE_URL,
      ssl: sslConfig,
    }
  : {
      type: 'postgres',
      host: env.DB_HOST,
      port: env.DB_PORT,
      username: env.DB_USERNAME,
      password: env.DB_PASSWORD,
      database: env.DB_DATABASE,
      ssl: sslConfig,
    };

export const AppDataSource = new DataSource({
  ...connectionOptions,
  synchronize: false,
  logging: env.NODE_ENV === 'development',
  entities: Object.values(entities),
  migrations: [`${__dirname}/migrations/*.{ts,js}`],
  migrationsRun: false,
});

export async function initializeDatabase(): Promise<void> {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
}
