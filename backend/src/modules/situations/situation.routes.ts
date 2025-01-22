import { registerGenericRoutes } from '@config/routes.config';
import { authMiddleware } from '@core/middlewares/auth.middleware';
import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { situationController } from './situation.controller';
import { Situation } from './situation.model';

export default async function situationRoutes(
  server: FastifyInstance,
  options: FastifyPluginOptions,
) {
  server.addHook('onRequest', authMiddleware);
  registerGenericRoutes(server, situationController, Situation);
}
