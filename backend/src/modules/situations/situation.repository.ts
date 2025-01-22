import { AppDataSource } from '@config/database.config';
import { BaseRepository } from '@modules/base/base.repository';
import { Situation } from './situation.model';

export class SituationRepository extends BaseRepository<Situation> {
  constructor() {
    super(Situation, AppDataSource);
  }

  async findByCode(code: string): Promise<Situation | null> {
    return this.findOne({
      where: { situation_code: code },
    });
  }
}

export const situationRepository = new SituationRepository();
