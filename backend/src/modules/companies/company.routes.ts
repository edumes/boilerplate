import { registerGenericRoutes } from '@config/routes';
import { companyController } from '@modules/companies/company.controller';
import { authMiddleware } from '@utils/auth.middleware';
import { FastifyInstance, FastifyPluginOptions } from 'fastify';

export default async function companyRoutes(
  server: FastifyInstance,
  options: FastifyPluginOptions,
) {
  server.addHook('onRequest', authMiddleware);
  registerGenericRoutes(server, companyController);
}
