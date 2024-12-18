import { env } from '@config/env.config';
import { logger } from '@core/utils/logger';
import Redis from 'ioredis';

const redisConfig = {
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  password: env.REDIS_PASSWORD,
  maxRetriesPerRequest: 3,
  retryStrategy(times: number) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  onError(error: Error) {
    logger.error('Redis Client Error', { error });
  },
};

export const redis = new Redis(redisConfig);

redis.on('connect', () => {
  logger.info('Redis connected successfully');
});

redis.on('error', error => {
  logger.error('Redis connection error', { error });
});
