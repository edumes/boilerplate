import { AppDataSource } from "../../config/database";
import { BaseRepository } from "../base/base.repository";
import { Company } from "./company.entity";

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
