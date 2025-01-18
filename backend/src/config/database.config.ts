import { env } from '@config/env.config';
import { logger } from '@core/utils/logger';
import { Audit } from '@modules/audits/audit.model';
import { Company } from '@modules/companies/company.model';
import { Notification } from '@modules/notifications/notification.model';
import { Project } from '@modules/projects/project.model';
import { Role } from '@modules/roles/role.model';
import { User } from '@modules/users/user.model';
import 'reflect-metadata';
import { DataSource } from 'typeorm';

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
  entities: [User, Audit, Company, Project, Role, Notification],
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
