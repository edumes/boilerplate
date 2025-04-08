import { ApiResponseBuilder } from '@core/utils/api-response.util';
import { ValidationError } from '@core/utils/errors.util';
import { BaseController } from '@modules/base/base.controller';
import { companyService } from '@modules/companies/company.service';
import { User } from '@modules/users/user.model';
import { userService } from '@modules/users/user.service';
import { FastifyReply, FastifyRequest } from 'fastify';
import i18next from 'i18next';

export class UserController extends BaseController<User> {
  constructor() {
    super(userService);
  }

  async create(request: FastifyRequest<{ Body: Partial<User> & Record<string, unknown> }>, reply: FastifyReply) {
    const userData = request.body;

    const existingUser = await userService.findByEmail(userData.user_email);
    if (existingUser) {
      throw new ValidationError(i18next.t('EMAIL_ALREADY_IN_USE'));
    }

    const company = await companyService.findById(userData.user_fk_company_id);
    if (!company) {
      throw new ValidationError(i18next.t('COMPANY_NOT_FOUND'));
    }

    const newUser = await super.create(request, reply);
    return reply.status(201).send(ApiResponseBuilder.success(newUser));
  }
}

export const userController = new UserController();
