import { registerGenericRoutes } from '@config/routes.config';
import { authMiddleware } from '@core/middlewares/auth.middleware';
import { companyController } from '@modules/companies/company.controller';
import { Company } from '@modules/companies/company.model';
import { FastifyInstance, FastifyPluginOptions } from 'fastify';

export default async function companyRoutes(
  server: FastifyInstance,
  options: FastifyPluginOptions
) {
  server.addHook('onRequest', authMiddleware);
  registerGenericRoutes(server, companyController, Company);
}
