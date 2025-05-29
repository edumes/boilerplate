import './config/alias.config'; // leave this import at the top
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

/**
 * Fastify server instance
 * @type {FastifyInstance}
 */
const server = Fastify({ logger: false });

/**
 * Configures server middlewares including:
 * - Security headers (Helmet)
 * - Static file serving
 * - Error handling
 * - HTTP logging
 * - Rate limiting (if Redis enabled)
 * - i18n middleware
 */
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

  server.setNotFoundHandler((request, reply) => {
    if (request.url.startsWith('/api/')) {
      reply.code(404).send({ error: 'Not Found' });
      return;
    }
    reply.sendFile('index.html');
  });

  server.setErrorHandler(fastifyErrorHandler);
  server.addHook('onRequest', httpLogger);
  if (appConfig.features.redis.enabled) {
    server.addHook('onRequest', rateLimitMiddleware);
  }
  server.addHook('preHandler', i18nMiddleware);
};

/**
 * Registers all application routes
 * @returns {Promise<void>}
 */
const configureRoutes = async () => {
  await registerRoutes(server);
  logger.info('Routes registered successfully');
};

/**
 * Initializes external services including:
 * - i18n internationalization
 * - Swagger documentation
 * - WebSocket server
 * - Database connection
 * - Redis connection (if enabled)
 * @returns {Promise<void>}
 */
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

/**
 * Initializes the server and all required services
 * @returns {Promise<void>}
 */
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

/**
 * Handles server startup errors and attempts to retry initialization
 * @param {Error} error - The error that occurred during startup
 */
const handleStartupError = (error: Error) => {
  logger.error('Server startup failed', { error });

  if (!AppDataSource.isInitialized || !server.server.listening) {
    logger.info('Retrying in 5 seconds...');
    setTimeout(initializeServer, 5000);
  }
};

/**
 * Handles uncaught process errors
 * @param {Error | any} error - The error that occurred
 * @param {string} type - The type of error (uncaughtException or unhandledRejection)
 */
const handleProcessError = (error: Error | any, type: string) => {
  globalErrorHandler(error, type);
};

/**
 * Closes all active connections (server, database, Redis)
 * @returns {Promise<void>}
 */
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

/**
 * Handles graceful shutdown of the application
 * @param {string} signal - The signal that triggered the shutdown
 * @returns {Promise<void>}
 */
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

// Register process error handlers
process.on('uncaughtException', error => handleProcessError(error, 'uncaughtException'));
process.on('unhandledRejection', reason => handleProcessError(reason, 'unhandledRejection'));

// Register shutdown handlers
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Health check endpoint
server.get('/health', async () => getSystemStatus());

// Start the server
initializeServer();
