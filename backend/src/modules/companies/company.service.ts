import { BaseService } from '@modules/base/base.service';
import { Company } from '@modules/companies/company.model';
import { companyRepository } from '@modules/companies/company.repository';

export class CompanyService extends BaseService<Company> {
  constructor() {
    super(companyRepository, 'Company');
  }

  async findByCnpj(cnpj: string): Promise<Company | null> {
    return companyRepository.findByCnpj(cnpj);
  }
}

export const companyService = new CompanyService();
