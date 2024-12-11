import { registerGenericRoutes } from '@config/routes.config';
import { auditController } from '@modules/audit/audit.controller';
import { FastifyInstance, FastifyPluginOptions } from 'fastify';

export default async function auditRoutes(server: FastifyInstance, options: FastifyPluginOptions) {
  registerGenericRoutes(server, auditController);

  server.get(
    '/entity/:entityName/:entityId',
    auditController.getEntityHistory.bind(auditController),
  );
}
