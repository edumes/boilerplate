import { logger } from '@core/utils/logger';
import chalk from 'chalk';
import { FastifyReply, FastifyRequest } from 'fastify';

export async function httpLogger(request: FastifyRequest, reply: FastifyReply) {
  const startTime = Date.now();

  reply.raw.on('finish', () => {
    const duration = Date.now() - startTime;

    const methodColored = chalk.blue(request.method);
    const urlColored = chalk.green(request.url);
    const statusCode = reply.statusCode;
    const statusColored =
      statusCode >= 500
        ? chalk.red(statusCode)
        : statusCode >= 400
          ? chalk.yellow(statusCode)
          : chalk.green(statusCode);
    const durationColored = chalk.magenta(`${duration}ms`);
    const userAgentColored = chalk.cyan(request.headers['user-agent'] || 'unknown');
    const ipColored = chalk.gray(request.ip);

    const message = `${methodColored} ${urlColored} - ${statusColored} - ${durationColored} - UA: ${userAgentColored} - IP: ${ipColored}`;

    logger.http(message, {
      method: request.method,
      url: request.url,
      status: reply.statusCode,
      duration: `${duration}ms`,
      userAgent: request.headers['user-agent'],
      ip: request.ip
    });
  });
}
