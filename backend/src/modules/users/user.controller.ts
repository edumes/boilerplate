import { FastifyReply, FastifyRequest } from "fastify";
import { ApiResponseBuilder } from "../../utils/api-response.util";
import { ValidationError } from "../../utils/errors";
import { BaseController } from "../base/base.controller";
import { User } from "./user.entity";
import { userService } from "./user.service";

export class UserController extends BaseController<User> {
  constructor() {
    super(userService);
  }

  // Sobrescreva ou adicione métodos específicos
  async create(
    request: FastifyRequest<{ Body: Partial<User> }>,
    reply: FastifyReply
  ) {
    const userData = request.body;
    const existingUser = await userService.findByEmail(userData.email);

    if (existingUser) {
      throw new ValidationError("Email already in use");
    }

    const newUser = await super.create(request, reply);
    return reply.status(201).send(ApiResponseBuilder.success(newUser));
  }
}

export const userController = new UserController();
