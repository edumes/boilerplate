import {
  DeepPartial,
  FindOptionsOrder,
  FindOptionsWhere,
  ILike,
  Repository,
} from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { PaginationOptions } from "../../utils/api-response.util";
import { AuditAction } from "../audit/audit.entity";
import { auditService } from "../audit/audit.service";
import { IBaseEntity } from "./base.entity";

type WhereConditions<T> = FindOptionsWhere<T>;

export interface SearchOptions extends PaginationOptions {
  searchFields?: string[];
  searchTerm?: string;
}

export interface IServiceHooks<T> {
  beforeCreate?(data: DeepPartial<T>): Promise<void>;
  afterCreate?(entity: T): Promise<void>;
  beforeUpdate?(id: number, data: QueryDeepPartialEntity<T>): Promise<void>;
  afterUpdate?(entity: T): Promise<void>;
  beforeDelete?(id: number): Promise<void>;
  afterDelete?(entity: T): Promise<void>;
}

export class BaseService<T extends IBaseEntity> {
  protected hooks: IServiceHooks<T> = {};

  constructor(
    protected repository: Repository<T>,
    protected entityName: string
  ) {}

  public getEntityName(): string {
    return this.entityName;
  }

  setHooks(hooks: IServiceHooks<T>) {
    this.hooks = hooks;
  }

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
    try {
      if (this.hooks.beforeCreate) {
        await this.hooks.beforeCreate(data);
      }

      const entity = this.repository.create(data);
      const savedEntity = await this.repository.save(entity);

      await auditService.logChange({
        entityName: this.entityName,
        entityId: savedEntity.id,
        action: AuditAction.CREATE,
        newValues: data,
      });

      if (this.hooks.afterCreate) {
        await this.hooks.afterCreate(savedEntity);
      }

      return savedEntity;
    } catch (error) {
      throw new Error(`Create operation failed: ${error.message}`);
    }
  }

  async update(id: number, data: QueryDeepPartialEntity<T>): Promise<T | null> {
    try {
      const oldEntity = await this.findById(id);
      if (!oldEntity) return null;

      if (this.hooks.beforeUpdate) {
        await this.hooks.beforeUpdate(id, data);
      }

      await this.repository.update(id, data);
      const updatedEntity = await this.findById(id);

      await auditService.logChange({
        entityName: this.entityName,
        entityId: id,
        action: AuditAction.UPDATE,
        oldValues: oldEntity,
        newValues: data,
      });

      if (this.hooks.afterUpdate && updatedEntity) {
        await this.hooks.afterUpdate(updatedEntity);
      }

      return updatedEntity;
    } catch (error) {
      throw new Error(`Update operation failed: ${error.message}`);
    }
  }

  async delete(id: number): Promise<void> {
    try {
      const entity = await this.findById(id);
      if (!entity) return;

      if (this.hooks.beforeDelete) {
        await this.hooks.beforeDelete(id);
      }

      await this.repository.delete(id);

      await auditService.logChange({
        entityName: this.entityName,
        entityId: id,
        action: AuditAction.DELETE,
        oldValues: entity,
      });

      if (this.hooks.afterDelete) {
        await this.hooks.afterDelete(entity);
      }
    } catch (error) {
      throw new Error(`Delete operation failed: ${error.message}`);
    }
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
