import { registerGenericRoutes, RouteDefinition } from '@config/routes.config';
import { authMiddleware } from '@core/middlewares/auth.middleware';
import { roleController } from '@modules/roles/role.controller';
import { Role } from '@modules/roles/role.model';
import { FastifyInstance, FastifyPluginOptions } from 'fastify';

export default async function roleRoutes(server: FastifyInstance, options: FastifyPluginOptions) {
  server.addHook('onRequest', authMiddleware);

  const additionalRoutes: RouteDefinition[] = [
    { method: 'post', url: '/users/:userId/roles/:roleId', handler: roleController.assignRole },
    { method: 'delete', url: '/users/:userId/roles/:roleId', handler: roleController.removeRole },
    { method: 'get', url: '/users/:userId/roles', handler: roleController.getUserRoles }
  ];

  registerGenericRoutes(server, roleController, Role, additionalRoutes);
}
