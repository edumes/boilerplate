import { BaseController } from '@modules/base/base.controller';
import { Situation } from './situation.model';
import { situationService } from './situation.service';

export class SituationController extends BaseController<Situation> {
  constructor() {
    super(situationService);
  }
}

export const situationController = new SituationController();
