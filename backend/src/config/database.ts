import { env } from '@config/env';
import { Audit } from '@modules/audit/audit.entity';
import { Company } from '@modules/companies/company.entity';
import { Project } from '@modules/projects/project.entity';
import { User } from '@modules/users/user.entity';
import { logger } from '@utils/logger';
import 'reflect-metadata';
import { DataSource } from 'typeorm';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USERNAME,
  password: env.DB_PASSWORD,
  database: env.DB_DATABASE,
  synchronize: env.NODE_ENV === 'development', // Apenas em desenvolvimento
  // logging: env.NODE_ENV === 'development',
  logging: false,
  entities: [User, Audit, Company, Project],
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
    console.log(error);

    if (retries > 0) {
      logger.info(`Retrying database connection in ${RETRY_DELAY / 1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return connectWithRetry(retries - 1);
    }

    throw error;
  }
}

export { AppDataSource, connectWithRetry };
