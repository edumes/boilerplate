import { registerGenericRoutes } from '@config/routes.config';
import { authMiddleware } from '@core/middlewares/auth.middleware';
import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { projectItemsController } from './project-item.controller';
import { ProjectItem } from './project-item.model';

export default async function projectItemRoutes(
  server: FastifyInstance,
  options: FastifyPluginOptions,
) {
  server.addHook('onRequest', authMiddleware);
  registerGenericRoutes(server, projectItemsController, ProjectItem);
}
