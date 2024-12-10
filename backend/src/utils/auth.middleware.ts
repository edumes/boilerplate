import { authConfig } from '@config/auth';
import { permissionService } from '@modules/permissions/permission.service';
import { userService } from '@modules/users/user.service';
import { UnauthorizedError } from '@utils/errors';
import { FastifyReply, FastifyRequest } from 'fastify';
import jwt from 'jsonwebtoken';

export async function authMiddleware(request: FastifyRequest, reply: FastifyReply) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new UnauthorizedError('No token provided');
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = jwt.verify(token, authConfig.jwt.secret) as {
      id: number;
      email: string;
      companyId: number;
    };

    const user = await userService.findById(decoded.id);
    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    request.user = user;
    request.token = token;
  } catch (error) {
    throw new UnauthorizedError('Invalid token');
  }
}

export function requirePermission(resource: string, action: string) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const user = request.user;

    if (!user) {
      throw new UnauthorizedError('User not authenticated');
    }

    await permissionService.requirePermission(user, resource, action);
  };
}
