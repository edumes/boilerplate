import { AppDataSource } from '@config/database.config';
import { logger } from '@core/utils/logger';
import { CreateDefaultAdmin } from './create-default-admin.seed';
import { CreateDefaultCompany } from './create-default-company.seed';
import { CreateDefaultRoles } from './create-default-roles.seed';

async function runSeeds() {
  try {
    await AppDataSource.initialize();
    logger.info('Database connection initialized');

    const seeds = [new CreateDefaultRoles(), new CreateDefaultCompany(), new CreateDefaultAdmin()];

    for (const seed of seeds) {
      logger.info(`Running seed: ${seed.constructor.name}`);
      await seed.up(AppDataSource.createQueryRunner());
      logger.info(`Seed ${seed.constructor.name} completed`);
    }

    logger.info('All seeds completed successfully');
    process.exit(0);
  } catch (error) {
    logger.error('Error running seeds:', error);
    process.exit(1);
  }
}

runSeeds();
