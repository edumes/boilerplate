import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDefaultCompany implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO companies (company_name, company_email, company_is_active)
      VALUES ('Default Company', 'default@company.com', true)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM companies 
      WHERE company_email = 'default@company.com'
    `);
  }
}
