import { FastifyReply, FastifyRequest } from 'fastify';
import { ApiResponseBuilder } from '../../utils/api-response.util';
import { ValidationError } from '../../utils/errors';
import { BaseController } from '../base/base.controller';
import { Company } from './company.entity';
import { companyService } from './company.service';

export class CompanyController extends BaseController<Company> {
  constructor() {
    super(companyService);
  }

  async create(request: FastifyRequest<{ Body: Partial<Company> }>, reply: FastifyReply) {
    const companyData = request.body;
    const existingCompany = await companyService.findByCnpj(companyData.company_cnpj);

    if (existingCompany) {
      throw new ValidationError('CNPJ already registered');
    }

    const newCompany = await super.create(request, reply);
    return reply.status(201).send(ApiResponseBuilder.success(newCompany));
  }
}

export const companyController = new CompanyController();
