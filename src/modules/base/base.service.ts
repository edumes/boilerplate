import { DeepPartial, FindOptionsOrder, Repository } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { PaginationOptions } from "../../utils/api-response.util";
import { IBaseEntity } from "./base.entity";

export class BaseService<T extends IBaseEntity> {
  constructor(protected repository: Repository<T>) {}

  async findAll(options: PaginationOptions = {}): Promise<[T[], number]> {
    const page = options.page || 1;
    const limit = options.limit || 10;
    const skip = (page - 1) * limit;
    const order = (options.order || {
      createdAt: "DESC",
    }) as FindOptionsOrder<T>;

    return this.repository.findAndCount({
      skip,
      take: limit,
      order,
    });
  }

  async findById(id: number): Promise<T | null> {
    return this.repository.findOneBy({ id } as any);
  }

  async create(data: DeepPartial<T>): Promise<T> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async update(id: number, data: QueryDeepPartialEntity<T>): Promise<T | null> {
    await this.repository.update(id, data);
    return this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
