import { BaseController } from '@modules/base/base.controller';
import { companyService } from '@modules/companies/company.service';
import { User } from '@modules/users/user.entity';
import { userService } from '@modules/users/user.service';
import { ApiResponseBuilder } from '@utils/api-response.util';
import { ValidationError } from '@utils/errors';
import { FastifyReply, FastifyRequest } from 'fastify';

export class UserController extends BaseController<User> {
  constructor() {
    super(userService);
  }

  async create(request: FastifyRequest<{ Body: Partial<User> }>, reply: FastifyReply) {
    const userData = request.body;

    // if (!userData.user_fk_company_id) {
    //   throw new ValidationError('Company ID is required');
    // }

    const existingUser = await userService.findByEmail(userData.user_email);
    if (existingUser) {
      throw new ValidationError('Email already in use');
    }

    const company = await companyService.findById(userData.user_fk_company_id);
    if (!company) {
      throw new ValidationError('Company not found');
    }

    const newUser = await super.create(request, reply);
    return reply.status(201).send(ApiResponseBuilder.success(newUser));
  }
}

export const userController = new UserController();
