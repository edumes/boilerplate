import {
  DeepPartial,
  FindOptionsOrder,
  FindOptionsWhere,
  ILike,
  Repository,
} from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { PaginationOptions } from "../../utils/api-response.util";
import { IBaseEntity } from "./base.entity";

type WhereConditions<T> = FindOptionsWhere<T>;

export interface SearchOptions extends PaginationOptions {
  searchFields?: string[];
  searchTerm?: string;
}

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

  async findByConditions(
    where: WhereConditions<T>,
    options: PaginationOptions = {}
  ): Promise<[T[], number]> {
    const page = options.page || 1;
    const limit = options.limit || 10;
    const skip = (page - 1) * limit;
    const order = (options.order || {
      createdAt: "DESC",
    }) as FindOptionsOrder<T>;

    return this.repository.findAndCount({
      where,
      skip,
      take: limit,
      order,
    });
  }

  async search(options: SearchOptions = {}): Promise<[T[], number]> {
    const {
      page = 1,
      limit = 10,
      searchFields = [],
      searchTerm = "",
      order = { createdAt: "DESC" as const },
    } = options;

    const skip = (page - 1) * limit;

    if (!searchTerm || searchFields.length === 0) {
      return this.findAll(options);
    }

    const whereConditions = searchFields.map((field) => ({
      [field]: ILike(`%${searchTerm}%`),
    })) as FindOptionsWhere<T>[];

    return this.repository.findAndCount({
      where: whereConditions,
      skip,
      take: limit,
      order: order as FindOptionsOrder<T>,
    });
  }

  async count(
    where: FindOptionsWhere<T> | FindOptionsWhere<T>[] = {}
  ): Promise<number> {
    return this.repository.count({ where });
  }
}
