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

const server = Fastify({ logger: false });

server.setErrorHandler(fastifyErrorHandler);
server.addHook('onRequest', httpLogger);

server.get('/health', async () => getSystemStatus());

const initializeServer = async () => {
  try {
    await setupSwagger(server);
    await AppDataSource.initialize();
    logger.info('Database connected successfully');

    await registerRoutes(server);
    logger.info('Routes registered successfully');

    await server.listen({ port: env.PORT, host: '0.0.0.0' });
    logger.info(`Server running on port ${env.PORT}`);
  } catch (error) {
    handleStartupError(error);
  }
};

const handleStartupError = (error: Error) => {
  logger.error('Server startup failed', { error });
  console.error(error);

  if (!AppDataSource.isInitialized || !server.server.listening) {
    logger.info('Retrying in 5 seconds...');
    setTimeout(initializeServer, 5000);
  }
};

const handleProcessError = (error: Error | any, type: string) => {
  globalErrorHandler(error, type);
};

process.on('uncaughtException', error => handleProcessError(error, 'uncaughtException'));
process.on('unhandledRejection', reason => handleProcessError(reason, 'unhandledRejection'));

const gracefulShutdown = async (signal: string) => {
  logger.info(`Received ${signal}. Shutting down...`);

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
    logger.error('Shutdown error', { error });
    console.error(error);
    process.exit(1);
  }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

initializeServer();
