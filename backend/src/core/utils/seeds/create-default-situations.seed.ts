import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDefaultSituations implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO situations (uuid, situation_code, situation_name, situation_description)
      VALUES 
        ('2189801c-41c3-4b84-9013-2c8215258d87', '001', 'In Progress', 'The process is ongoing'),
        ('55f1a4e6-009f-4719-818f-8e8fde0e62fb', '002', 'Pending', 'Awaiting further action'),
        ('7bcd0bc6-93f6-4417-8613-6e3cbf3e915e', '003', 'Completed', 'The process is complete');
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM situations`);
  }
}
