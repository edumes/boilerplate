import { registerGenericRoutes } from '@config/routes.config';
import { authMiddleware } from '@core/middlewares/auth.middleware';
import { projectController } from '@modules/projects/project.controller';
import { FastifyInstance, FastifyPluginOptions } from 'fastify';

export default async function projectRoutes(
  server: FastifyInstance,
  options: FastifyPluginOptions,
) {
  server.addHook('onRequest', authMiddleware);
  registerGenericRoutes(server, projectController);
}
