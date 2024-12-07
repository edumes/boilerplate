import { FastifyReply, FastifyRequest } from "fastify";
import { ApiResponseBuilder } from "../../utils/api-response.util";
import { authService } from "./auth.service";

export class AuthController {
  async login(
    request: FastifyRequest<{
      Body: { user_email: string; user_password: string };
    }>,
    reply: FastifyReply
  ) {
    const { user_email, user_password } = request.body;
    const result = await authService.login(user_email, user_password);
    return reply.send(ApiResponseBuilder.success(result));
  }
}

export const authController = new AuthController();
