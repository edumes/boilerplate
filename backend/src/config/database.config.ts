import { env } from '@config/env.config';
import { logger } from '@core/utils/logger';
import glob from 'glob';
import path from 'path';
import 'reflect-metadata';
import { DataSource } from 'typeorm';

function loadEntities() {
  const basePath = path.join(__dirname, '..');
  const modelFiles = glob.sync(`${basePath}/modules/**/*.model.@(ts|js)`);

  return modelFiles.map((file) => {
    const normalizedFile = env.NODE_ENV === 'development' ? file : file.replace(/\.ts$/, '.js');
    const module = require(normalizedFile);

    return module.default || Object.values(module)[0];
  });
}

const AppDataSource = new DataSource({
  type: 'postgres',
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USERNAME,
  password: env.DB_PASSWORD,
  database: env.DB_DATABASE,
  synchronize: env.NODE_ENV === 'development', // apenas em desenvolvimento
  // logging: env.NODE_ENV === 'development',
  // extra: {
  //   ssl: {
  //     rejectUnauthorized: false
  //   }
  // },
  logging: false,
  entities: loadEntities(),
  migrations: ['src/migrations/*.ts'],
});

const MAX_RETRIES = 5;
const RETRY_DELAY = 5000;

async function connectWithRetry(retries = MAX_RETRIES): Promise<void> {
  try {
    await AppDataSource.initialize();
    logger.info('Database connected successfully');
  } catch (error) {
    logger.error('Database connection failed', { error, retriesLeft: retries });

    if (retries > 0) {
      logger.info(`Retrying database connection in ${RETRY_DELAY / 1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return connectWithRetry(retries - 1);
    }

    throw error;
  }
}

export { AppDataSource, connectWithRetry };

