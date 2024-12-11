import { IBaseModel } from '@modules/base/base.model';
import { BaseService } from '@modules/base/base.service';
import { Repository } from 'typeorm';

export class TestBaseService<T extends IBaseModel> extends BaseService<T> {
  constructor(repository: Repository<T>) {
    super(repository, 'TestEntity');
  }
}
