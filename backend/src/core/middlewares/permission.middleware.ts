import { UnauthorizedError } from '@core/utils/errors.util';
import { FastifyReply, FastifyRequest } from 'fastify';

export enum Permission {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
}

export function checkPermission(resource: string, permission: Permission) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const user = request.user;
    if (!user) {
      throw new UnauthorizedError('User not authenticated');
    }

    const userRole = user.role;
    if (!userRole) {
      throw new UnauthorizedError('User has no role assigned');
    }

    const hasPermission = userRole.role_permissions[resource]?.[permission];
    if (!hasPermission) {
      throw new UnauthorizedError(`User doesn't have ${permission} permission for ${resource}`);
    }
  };
}
