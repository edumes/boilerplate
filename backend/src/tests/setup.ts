import { AppDataSource } from '@config/database';
import { logger } from '@utils/logger';

logger.silent = true;

jest.setTimeout(10000);

beforeAll(async () => {
  await AppDataSource.initialize();
});

afterAll(async () => {
  await AppDataSource.destroy();
});
