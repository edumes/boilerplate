import { redis } from '@config/redis.config';
import { logger } from '@core/utils/logger';

export class Queue {
  static async addJob(queue: string, data: any) {
    await redis.lpush(`queue:${queue}`, JSON.stringify(data));
  }

  static async processJobs(queue: string, processor: (data: any) => Promise<void>) {
    while (true) {
      const job = await redis.brpop(`queue:${queue}`, 0);
      if (job) {
        try {
          await processor(JSON.parse(job[1]));
        } catch (error) {
          logger.error('Job processing error', { error, queue, job });
        }
      }
    }
  }
}
