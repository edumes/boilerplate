import { UnauthorizedError } from '@core/utils/errors.util';
import { FastifyReply, FastifyRequest } from 'fastify';
import i18next from 'i18next';

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
      throw new UnauthorizedError(i18next.t('USER_NOT_AUTHENTICATED'));
    }

    const userRole = user.role;
    if (!userRole) {
      throw new UnauthorizedError(i18next.t('USER_HAS_NO_ROLE_ASSIGNED'));
    }

    const hasPermission = userRole.role_permissions[resource]?.[permission];
    if (!hasPermission) {
      throw new UnauthorizedError(i18next.t('USER_DOESNT_HAVE_PERMISSION', { permission, resource }));
    }
  };
}
