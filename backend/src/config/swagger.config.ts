import { logger } from '@core/utils/logger';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { FastifyInstance } from 'fastify';

export async function setupSwagger(server: FastifyInstance) {
  await server.register(swagger, {
    swagger: {
      info: {
        title: 'API Documentation',
        description: 'Automatically generated API documentation',
        version: '1.0.0',
      },
      host: 'localhost:3333',
      schemes: ['http', 'https'],
      consumes: ['application/json'],
      produces: ['application/json'],
    },
  });

  await server.register(swaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: false,
      persistAuthorization: true,
    },
    staticCSP: true,
    transformStaticCSP: header => header,
  });

  logger.info(`Documentation available at /docs`);
}
