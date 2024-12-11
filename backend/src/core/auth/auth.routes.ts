import { authController } from '@core/auth/auth.controller';
import { FastifyInstance, FastifyPluginOptions } from 'fastify';

export default async function authRoutes(server: FastifyInstance, options: FastifyPluginOptions) {
  server.post('/login', authController.login.bind(authController));
  server.get('/me', authController.getCurrentUser.bind(authController));
}
