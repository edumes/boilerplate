import { authService } from '@core/auth/auth.service';
import { ApiResponseBuilder } from '@core/utils/api-response.util';
import { UnauthorizedError } from '@core/utils/errors.util';
// import genericRoutes, { RouteSchema } from '@core/utils/route-schema.decorator';
import { FastifyReply, FastifyRequest } from 'fastify';

export class AuthController {
  // @RouteSchema(genericRoutes.login)
  async login(
    request: FastifyRequest<{
      Body: { user_email: string; user_password: string };
    }>,
    reply: FastifyReply,
  ) {
    const { user_email, user_password } = request.body;
    const result = await authService.login(user_email, user_password);
    return reply.send(ApiResponseBuilder.success(result));
  }

  async getCurrentUser(request: FastifyRequest, reply: FastifyReply) {
    const user = await authService.getCurrentUser(request);

    if (!user) {
      return reply.status(401).send(new UnauthorizedError('User not authenticated'));
    }

    return reply.send(ApiResponseBuilder.success(user));
  }
}

export const authController = new AuthController();
