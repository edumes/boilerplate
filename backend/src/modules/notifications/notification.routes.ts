import { registerGenericRoutes } from '@config/routes.config';
import { authMiddleware } from '@core/middlewares/auth.middleware';
import { notificationController } from '@modules/notifications/notification.controller';
import { Notification } from '@modules/notifications/notification.model';
import { FastifyInstance, FastifyPluginOptions } from 'fastify';

export default async function notificationRoutes(
  server: FastifyInstance,
  options: FastifyPluginOptions
) {
  server.addHook('onRequest', authMiddleware);
  registerGenericRoutes(server, notificationController, Notification);
}
