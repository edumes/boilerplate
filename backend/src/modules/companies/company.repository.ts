import { AppDataSource } from '@config/database.config';
import { BaseRepository } from '@modules/base/base.repository';
import { Company } from '@modules/companies/company.model';

export class CompanyRepository extends BaseRepository<Company> {
  constructor() {
    super(Company, AppDataSource);
  }

  async findByCnpj(cnpj: string): Promise<Company | null> {
    return this.findOne({
      where: { company_cnpj: cnpj },
    });
  }
}

export const companyRepository = new CompanyRepository();
