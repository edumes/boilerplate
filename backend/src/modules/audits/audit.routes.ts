import { authMiddleware } from '@core/middlewares/auth.middleware';
import { auditController } from '@modules/audits/audit.controller';
import { FastifyInstance, FastifyPluginOptions } from 'fastify';

export default async function auditRoutes(server: FastifyInstance, options: FastifyPluginOptions) {
  server.addHook('onRequest', authMiddleware);

  server.get(
    '/users/:userId/roles/:roleId',
    auditController.getEntityHistory.bind(auditController),
  );
}
