import { registerGenericRoutes } from '@config/routes.config';
import { authMiddleware } from '@core/middlewares/auth.middleware';
import { userController } from '@modules/users/user.controller';
import { User } from '@modules/users/user.model';
import { FastifyInstance, FastifyPluginOptions } from 'fastify';

export default async function userRoutes(server: FastifyInstance, options: FastifyPluginOptions) {
  server.addHook('onRequest', authMiddleware);
  registerGenericRoutes(server, userController, User);
}
