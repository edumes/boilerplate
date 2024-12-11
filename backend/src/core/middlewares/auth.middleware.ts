import { authConfig } from '@config/auth.config';
import { UnauthorizedError } from '@core/utils/errors.util';
import { userService } from '@modules/users/user.service';
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
