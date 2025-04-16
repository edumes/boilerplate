import { Situation } from '@modules/situations/situation.model';
import { In, MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDefaultSituations implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const situationRepository = queryRunner.manager.getRepository(Situation);

    const existingSituations = await situationRepository.find({
      where: {
        situation_code: In(['001', '002', '003'])
      }
    });

    if (existingSituations.length === 0) {
      const situations = situationRepository.create([
        {
          situation_code: '001',
          situation_name: 'In Progress',
          situation_description: 'The process is ongoing'
        },
        {
          situation_code: '002',
          situation_name: 'Pending',
          situation_description: 'Awaiting further action'
        },
        {
          situation_code: '003',
          situation_name: 'Completed',
          situation_description: 'The process is complete'
        }
      ]);

      await situationRepository.save(situations);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const situationRepository = queryRunner.manager.getRepository(Situation);
    await situationRepository.delete({});
  }
}