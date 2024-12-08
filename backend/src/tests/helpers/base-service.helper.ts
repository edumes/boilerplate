import { BaseService } from '@modules/base/base.service';
import { IBaseEntity } from '@modules/base/base.entity';
import { Repository } from 'typeorm';

export class TestBaseService<T extends IBaseEntity> extends BaseService<T> {
  constructor(repository: Repository<T>) {
    super(repository, 'TestEntity');
  }
} 