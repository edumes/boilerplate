import './config/alias.config'; // deixar esse import sempre no topo
import { AppDataSource } from '@config/database.config';
import { env } from '@config/env.config';
import { registerRoutes } from '@config/routes.config';
import { setupSwagger } from '@config/swagger.config';
import { fastifyErrorHandler, globalErrorHandler } from '@core/handlers/error.handler';
import { httpLogger } from '@core/middlewares/http-logger.middleware';
import getSystemStatus from '@core/utils/health.util';
import { logger } from '@core/utils/logger';
import Fastify from 'fastify';

const server = Fastify({
  logger: false,
});

server.setErrorHandler(fastifyErrorHandler);
server.addHook('onRequest', httpLogger);

server.get('/health', async () => getSystemStatus());

const start = async () => {
  try {
    await setupSwagger(server);

    await AppDataSource.initialize();
    logger.info('Database connected successfully');

    await registerRoutes(server);
    logger.info('Routes registered successfully');

    await server.listen({ port: env.PORT, host: '0.0.0.0' });
    logger.info(`Server running on port ${env.PORT}`);
  } catch (err) {
    logger.error('Failed to start server', { error: err });
    console.error(err);

    if (!AppDataSource.isInitialized) {
      logger.info('Attempting to reconnect to database in 5 seconds...');
      setTimeout(start, 5000);
      return;
    }

    if (!server.server.listening) {
      logger.info('Attempting to restart server in 5 seconds...');
      setTimeout(start, 5000);
      return;
    }
  }
};

process.on('uncaughtException', error => {
  globalErrorHandler(error, 'uncaughtException');
});

process.on('unhandledRejection', (reason: any) => {
  globalErrorHandler(reason, 'unhandledRejection');
});

const smartShutdown = async (signal: string) => {
  logger.info(`Received ${signal}. Starting shutdown...`);

  try {
    await server.close();
    logger.info('Server closed');

    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      logger.info('Database connection closed');
    }

    logger.info('Shutdown completed');
    process.exit(0);
  } catch (error) {
    logger.error('Error during shutdown', { error });
    console.error(error);
    process.exit(1);
  }
};

process.on('SIGTERM', () => smartShutdown('SIGTERM'));
process.on('SIGINT', () => smartShutdown('SIGINT'));

start();
