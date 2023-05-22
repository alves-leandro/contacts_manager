import 'dotenv/config';
import 'reflect-metadata';
import path from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';

const dataSourceConfig = (): DataSourceOptions => {
  const entitiePath: string = path.join(__dirname, './entities/**.{ts,js}');
  const migrationsPath: string = path.join(__dirname, './migrations/**.{ts,js}');

  const nodeEnv: string | undefined = process.env.NODE_ENV;

  if (nodeEnv === 'test') {
    return {
      type: 'sqlite',
      database: ':memory:',
      synchronize: true,
      entities: [entitiePath],
    };
  }

  const dbUrl: string | undefined = process.env.DATABASE_URL;

  if (!dbUrl) throw new Error('Env var DATABASE_URL does not exists');

  return {
    type: 'postgres',
    url: dbUrl,
    synchronize: false,
    logging: true,
    migrations: [migrationsPath],
    entities: [entitiePath],
  };
};

const AppDataSource = new DataSource(dataSourceConfig());

export { AppDataSource };