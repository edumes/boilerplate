import { IBaseEntity } from '@modules/base/base.entity';
import { DataSource, Repository } from 'typeorm';

export class BaseRepository<T extends IBaseEntity> extends Repository<T> {
  constructor(entity: { new (): T }, dataSource: DataSource) {
    super(entity, dataSource.createEntityManager());
  }

  // Métodos comuns podem ser adicionados aqui
}
