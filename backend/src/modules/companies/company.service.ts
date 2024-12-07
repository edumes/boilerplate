import { BaseService } from "../base/base.service";
import { Company } from "./company.entity";
import { companyRepository } from "./company.repository";

export class CompanyService extends BaseService<Company> {
  constructor() {
    super(companyRepository, "Company");
  }

  async findByCnpj(cnpj: string): Promise<Company | null> {
    return companyRepository.findByCnpj(cnpj);
  }
}

export const companyService = new CompanyService(); 