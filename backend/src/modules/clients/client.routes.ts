import { registerGenericRoutes } from '@config/routes.config';
import { authMiddleware } from '@core/middlewares/auth.middleware';
import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { clientController } from './client.controller';
import { Client } from './client.model';

export default async function clientRoutes(server: FastifyInstance, options: FastifyPluginOptions) {
  server.addHook('onRequest', authMiddleware);
  registerGenericRoutes(server, clientController, Client);
}
