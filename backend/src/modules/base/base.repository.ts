import { DataSource, Repository } from 'typeorm';
import { IBaseEntity } from './base.entity';

export class BaseRepository<T extends IBaseEntity> extends Repository<T> {
  constructor(entity: { new (): T }, dataSource: DataSource) {
    super(entity, dataSource.createEntityManager());
  }

  // Métodos comuns podem ser adicionados aqui
}
