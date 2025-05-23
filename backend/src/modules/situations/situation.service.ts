import { BaseService } from '@modules/base/base.service';
import { Situation } from './situation.model';
import { situationRepository } from './situation.repository';

export class SituationService extends BaseService<Situation> {
  constructor() {
    super(situationRepository, 'Situation');

    this.setHooks({
      beforeCreate: async data => {}
    });
  }

  async findByCode(code: string): Promise<Situation | null> {
    return situationRepository.findByCode(code);
  }
}

export const situationService = new SituationService();
