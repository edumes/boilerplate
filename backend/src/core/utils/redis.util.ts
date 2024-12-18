import { env } from '@config/env.config';
import { redis } from '@config/redis.config';
import { logger } from '@core/utils/logger';

export class RedisHelper {
  static async cache<T>(
    key: string,
    fetchData: () => Promise<T>,
    ttl: number = env.REDIS_TTL,
  ): Promise<T> {
    try {
      const cached = await redis.get(key);
      if (cached) {
        return JSON.parse(cached);
      }

      const data = await fetchData();
      await redis.set(key, JSON.stringify(data), 'EX', ttl);
      return data;
    } catch (error) {
      logger.error('Redis cache error', { error, key });
      return await fetchData();
    }
  }

  static async invalidate(pattern: string): Promise<void> {
    const keys = await redis.keys(pattern);
    if (keys.length) {
      await redis.del(...keys);
    }
  }
}
