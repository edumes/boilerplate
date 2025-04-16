import { Company } from '@modules/companies/company.model';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDefaultCompany implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const companyRepository = queryRunner.manager.getRepository(Company);

    const existingCompany = await companyRepository.findOne({
      where: { company_email: 'default@company.com' }
    });

    if (!existingCompany) {
      const defaultCompany = companyRepository.create({
        company_name: 'Default Company',
        company_email: 'default@company.com',
        company_is_active: true
      });

      await companyRepository.save(defaultCompany);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const companyRepository = queryRunner.manager.getRepository(Company);
    await companyRepository.delete({ company_email: 'default@company.com' });
  }
}