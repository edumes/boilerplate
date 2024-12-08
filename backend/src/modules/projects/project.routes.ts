import { registerGenericRoutes } from '@config/routes';
import { projectController } from '@modules/projects/project.controller';
import { authMiddleware } from '@utils/auth.middleware';
import { FastifyInstance, FastifyPluginOptions } from 'fastify';

export default async function projectRoutes(
  server: FastifyInstance,
  options: FastifyPluginOptions,
) {
  server.addHook('onRequest', authMiddleware);
  registerGenericRoutes(server, projectController);
}
