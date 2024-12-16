import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDefaultCompany implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO companies (uuid, company_name, company_email, company_is_active)
      VALUES ('67eb0091-f527-4097-967c-1bd5636fca9d', 'Default Company', 'default@company.com', true)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM companies 
      WHERE company_email = 'default@company.com'
    `);
  }
}
