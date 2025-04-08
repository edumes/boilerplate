import { ApiResponseBuilder } from '@core/utils/api-response.util';
import { ValidationError } from '@core/utils/errors.util';
import { BaseController } from '@modules/base/base.controller';
import { Company } from '@modules/companies/company.model';
import { companyService } from '@modules/companies/company.service';
import { FastifyReply, FastifyRequest } from 'fastify';
import i18next from 'i18next';

export class CompanyController extends BaseController<Company> {
  constructor() {
    super(companyService);
  }

  async create(request: FastifyRequest<{ Body: Partial<Company> }>, reply: FastifyReply) {
    const companyData = request.body;
    const existingCompany = await companyService.findByCnpj(companyData.company_cnpj);

    if (existingCompany) {
      throw new ValidationError(i18next.t('CNPJ_ALREADY_REGISTERED'));
    }

    const newCompany = await super.create(request, reply);
    return reply.status(201).send(ApiResponseBuilder.success(newCompany));
  }
}

export const companyController = new CompanyController();
