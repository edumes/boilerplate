import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDefaultRoles implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO roles (uuid, role_name, role_permissions)
      VALUES 
        ('d2b00dc6-444f-4267-b91b-07a876e14d6b', 'admin', '{
          "users": {"create": true, "read": true, "update": true, "delete": true},
          "roles": {"create": true, "read": true, "update": true, "delete": true},
          "companies": {"create": true, "read": true, "update": true, "delete": true}
        }')
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM roles WHERE role_name = 'admin'`);
  }
}
