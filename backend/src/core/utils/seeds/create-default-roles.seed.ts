import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDefaultRoles implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO roles (role_name, role_permissions)
      VALUES 
        ('admin', '{
          "users": {"create": true, "read": true, "update": true, "delete": true},
          "roles": {"create": true, "read": true, "update": true, "delete": true},
          "companies": {"create": true, "read": true, "update": true, "delete": true}
        }')
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM roles WHERE role_name = admin`);
  }
}