import './config/alias.config'; // deixar esse import sempre no topo
import { appConfig } from '@config/app.config';
import { AppDataSource } from '@config/database.config';
import { env } from '@config/env.config';
import { setupI18n } from '@config/i18n.config';
import { redis } from '@config/redis.config';
import { registerRoutes } from '@config/routes.config';
import { setupSwagger } from '@config/swagger.config';
import { setupWebSocket } from '@config/websocket.config';
import { fastifyErrorHandler, globalErrorHandler } from '@core/handlers/error.handler';
import { httpLogger } from '@core/middlewares/http-logger.middleware';
import { i18nMiddleware } from '@core/middlewares/i18n.middleware';
import { rateLimitMiddleware } from '@core/middlewares/rate-limit.middleware';
import getSystemStatus from '@core/utils/health.util';
import { logger } from '@core/utils/logger';
import websocketRoutes from '@core/websocket/websocket.routes';
import fastifyHelmet from '@fastify/helmet';
import fastifyStatic from '@fastify/static';
import Fastify from 'fastify';
import path from 'path';

const server = Fastify({ logger: false });

const configureMiddlewares = () => {
  server.register(fastifyHelmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", 'https:'],
        scriptSrc: ["'self'", 'https:'],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'", 'https:']
      }
    }
  });

  server.register(fastifyStatic, {
    root: path.join(__dirname, '../public'),
    prefix: '/public/',
    decorateReply: false
  });

  server.register(fastifyStatic, {
    root: path.join(__dirname, '../../frontend/dist'),
    prefix: '/'
  });

  server.setErrorHandler(fastifyErrorHandler);
  server.addHook('onRequest', httpLogger);
  if (appConfig.features.redis.enabled) {
    server.addHook('onRequest', rateLimitMiddleware);
  }
  server.addHook('preHandler', i18nMiddleware);
};

const configureRoutes = async () => {
  await registerRoutes(server);
  logger.info('Routes registered successfully');
};

const configureExternalServices = async () => {
  await setupI18n();

  await setupSwagger(server);

  await setupWebSocket(server);
  await server.register(websocketRoutes, { prefix: '/api/v1' });

  await AppDataSource.initialize();
  logger.info('Database connected successfully');

  if (appConfig.features.redis.enabled) {
    await redis.ping();
    logger.info('Redis connected successfully');
  }
};

const initializeServer = async () => {
  try {
    await configureExternalServices();
    configureMiddlewares();
    await configureRoutes();

    await server.listen({ port: env.PORT, host: '0.0.0.0' });
    logger.info(`Server running on port ${env.PORT}`);
  } catch (error) {
    handleStartupError(error);
  }
};

const handleStartupError = (error: Error) => {
  logger.error('Server startup failed', { error });

  if (!AppDataSource.isInitialized || !server.server.listening) {
    logger.info('Retrying in 5 seconds...');
    setTimeout(initializeServer, 5000);
  }
};

const handleProcessError = (error: Error | any, type: string) => {
  globalErrorHandler(error, type);
};

const closeConnections = async () => {
  if (server.server.listening) {
    await server.close();
    logger.info('Server closed');
  }

  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
    logger.info('Database connection closed');
  }

  if (appConfig.features.redis.enabled) {
    await redis.quit();
    logger.info('Redis connection closed');
  }
};

const gracefulShutdown = async (signal: string) => {
  logger.info(`Received ${signal}. Shutting down...`);
  try {
    await closeConnections();
    logger.info('Shutdown completed');
    process.exit(0);
  } catch (error) {
    logger.error('Shutdown error', { error });
    process.exit(1);
  }
};

process.on('uncaughtException', error => handleProcessError(error, 'uncaughtException'));
process.on('unhandledRejection', reason => handleProcessError(reason, 'unhandledRejection'));

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

server.get('/health', async () => getSystemStatus());

initializeServer();
