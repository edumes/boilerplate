import { registerGenericRoutes } from '@config/routes';
import { userController } from '@modules/users/user.controller';
import { authMiddleware } from '@utils/auth.middleware';
import { FastifyInstance, FastifyPluginOptions } from 'fastify';

export default async function userRoutes(server: FastifyInstance, options: FastifyPluginOptions) {
  server.addHook('onRequest', authMiddleware);
  registerGenericRoutes(server, userController);
}
