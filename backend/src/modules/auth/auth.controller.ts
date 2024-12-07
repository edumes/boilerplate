import { FastifyReply, FastifyRequest } from "fastify";
import { ApiResponseBuilder } from "../../utils/api-response.util";
import { authService } from "./auth.service";

export class AuthController {
  async login(
    request: FastifyRequest<{
      Body: { email: string; password: string };
    }>,
    reply: FastifyReply
  ) {
    const { email, password } = request.body;
    const result = await authService.login(email, password);
    return reply.send(ApiResponseBuilder.success(result));
  }
}

export const authController = new AuthController();
