import { FastifyRequest, FastifyReply } from "fastify";
import { BaseController } from "../base/base.controller";
import { User } from "./user.entity";
import { userService } from "./user.service";
import { ApiResponseBuilder } from "../../utils/api-response.util";

export class UserController extends BaseController<User> {
  constructor() {
    super(userService);
  }

  // Sobrescreva ou adicione métodos específicos
  async create(
    request: FastifyRequest<{ Body: Partial<User> }>,
    reply: FastifyReply
  ) {
    try {
      const userData = request.body;
      const existingUser = await userService.findByEmail(userData.email);

      if (existingUser) {
        return reply.status(400).send(
          ApiResponseBuilder.error('EMAIL_IN_USE', 'Email already in use')
        );
      }

      return super.create(request, reply);
    } catch (error) {
      return reply.status(500).send(
        ApiResponseBuilder.error('INTERNAL_SERVER_ERROR', 'Internal server error')
      );
    }
  }
}

export const userController = new UserController();