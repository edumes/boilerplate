import { Role } from '@modules/roles/role.model';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDefaultRoles implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const roleRepository = queryRunner.manager.getRepository(Role);

    const adminRole = roleRepository.create({
      role_name: 'admin',
      role_permissions: {
        users: { create: true, read: true, update: true, delete: true },
        roles: { create: true, read: true, update: true, delete: true },
        companies: { create: true, read: true, update: true, delete: true }
      }
    });

    await roleRepository.save(adminRole);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.delete(Role, { role_name: 'admin' });
  }
}