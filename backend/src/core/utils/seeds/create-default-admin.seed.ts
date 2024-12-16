import { authConfig } from '@config/auth.config';
import * as bcrypt from 'bcrypt';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDefaultAdmin implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const adminRole = await queryRunner.query(
      `SELECT role_id FROM roles WHERE role_name = 'admin' LIMIT 1`,
    );

    if (!adminRole || adminRole.length === 0) {
      throw new Error('Admin role not found. Please run the CreateDefaultRoles migration first.');
    }

    const defaultCompany = await queryRunner.query(
      `SELECT company_id FROM companies WHERE company_email = 'default@company.com' LIMIT 1`,
    );

    if (!defaultCompany || defaultCompany.length === 0) {
      throw new Error(
        'Default company not found. Please run the CreateDefaultCompany migration first.',
      );
    }

    const hashedPassword = await bcrypt.hash('1234', authConfig.passwordSaltRounds);

    await queryRunner.query(`
      INSERT INTO users (
        user_name,
        user_email,
        user_password,
        user_is_active,
        user_fk_role_id,
        user_fk_company_id
      )
      VALUES (
        'ADMIN',
        'admin@admin.com',
        '${hashedPassword}',
        true,
        ${adminRole[0].role_id},
        ${defaultCompany[0].company_id}
      )
      ON CONFLICT (user_email) DO NOTHING
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM users 
      WHERE user_email = 'admin@admin.com'
    `);
  }
}
