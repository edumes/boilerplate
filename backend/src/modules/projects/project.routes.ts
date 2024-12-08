import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { registerGenericRoutes } from '../../config/routes';
import { authMiddleware } from '../../utils/auth.middleware';
import { projectController } from './project.controller';

export default async function projectRoutes(
  server: FastifyInstance,
  options: FastifyPluginOptions,
) {
  server.addHook('onRequest', authMiddleware);
  registerGenericRoutes(server, projectController);
}
