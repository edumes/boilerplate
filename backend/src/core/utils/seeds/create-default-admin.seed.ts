import { authConfig } from '@config/auth.config';
import { Company } from '@modules/companies/company.model';
import { Role } from '@modules/roles/role.model';
import { User } from '@modules/users/user.model';
import * as bcrypt from 'bcrypt';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDefaultAdmin implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const roleRepository = queryRunner.manager.getRepository(Role);
    const companyRepository = queryRunner.manager.getRepository(Company);
    const userRepository = queryRunner.manager.getRepository(User);

    const adminRole = await roleRepository.findOne({
      where: { role_name: 'admin' }
    });

    if (!adminRole) {
      throw new Error('Admin role not found. Please run the CreateDefaultRoles migration first.');
    }

    const defaultCompany = await companyRepository.findOne({
      where: { company_email: 'default@company.com' }
    });

    if (!defaultCompany) {
      throw new Error('Default company not found. Please run the CreateDefaultCompany migration first.');
    }

    const existingAdmin = await userRepository.findOne({
      where: { user_email: 'admin@admin.com' }
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('1234', authConfig.passwordSaltRounds);

      const adminUser = userRepository.create({
        user_name: 'ADMIN',
        user_email: 'admin@admin.com',
        user_password: hashedPassword,
        user_is_active: true,
        role: adminRole,
        company: defaultCompany
      });

      await userRepository.save(adminUser);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const userRepository = queryRunner.manager.getRepository(User);
    await userRepository.delete({ user_email: 'admin@admin.com' });
  }
}