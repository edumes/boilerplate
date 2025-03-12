import { IBaseModel } from '@modules/base/base.model';
import { DataSource, Repository } from 'typeorm';

export class BaseRepository<T extends IBaseModel> extends Repository<T> {
  constructor(model: { new (): T }, dataSource: DataSource) {
    super(model, dataSource.createEntityManager());
  }
}
