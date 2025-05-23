import { env } from '@config/env.config';
import { redis } from '@config/redis.config';
import { FastifyReply, FastifyRequest } from 'fastify';

export async function rateLimitMiddleware(request: FastifyRequest, reply: FastifyReply) {
  const key = `ratelimit:${request.ip}`;
  const limit = env.RATE_LIMIT_MAX;
  const window = env.RATE_LIMIT_WINDOW;

  const current = await redis.incr(key);

  if (current === 1) {
    await redis.expire(key, window);
  }

  if (current > limit) {
    return reply.status(429).send({
      error: 'Too many requests',
      waitFor: await redis.ttl(key)
    });
  }
}
