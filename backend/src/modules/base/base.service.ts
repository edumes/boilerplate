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
import { User } from "../users/user.entity";
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

export interface ServiceContext {
  user?: User;
  token?: string;
}

export class BaseService<T extends IBaseEntity> {
  protected hooks: IServiceHooks<T> = {};
  protected context: ServiceContext = {};

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

  setContext(context: ServiceContext) {
    this.context = context;
  }

  protected getCurrentUser(): User | undefined {
    return this.context.user;
  }

  private getRelationFields(): string[] {
    const metadata = this.repository.metadata;
    return metadata.relations
      .filter((relation) =>
        metadata.columns.some(
          (column) =>
            column.propertyName.includes("_fk_") &&
            column.propertyName.includes(relation.propertyName)
        )
      )
      .map((relation) => relation.propertyName);
  }

  async findAll(options: PaginationOptions = {}): Promise<[T[], number]> {
    const page = options.page || 1;
    const limit = options.limit || 10;
    const skip = (page - 1) * limit;
    const order = (options.order || {
      created_at: "DESC",
    }) as FindOptionsOrder<T>;

    const relations = this.getRelationFields();

    return this.repository.findAndCount({
      skip,
      take: limit,
      order,
      relations,
    });
  }

  async findById(id: number): Promise<T | null> {
    const relations = this.getRelationFields();
    return this.repository.findOne({
      where: { id } as any,
      relations,
    });
  }

  async create(data: DeepPartial<T>): Promise<T> {
    try {
      const user = this.getCurrentUser();

      if (this.hooks.beforeCreate) {
        await this.hooks.beforeCreate(data);
      }

      const entity = this.repository.create(data);
      const savedEntity = await this.repository.save(entity);

      await auditService.logChange({
        audit_entity_name: this.entityName,
        audit_action: AuditAction.CREATE,
        audit_new_values: data,
        audit_fk_user_id: user?.id,
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

      const user = this.getCurrentUser();

      if (this.hooks.beforeUpdate) {
        await this.hooks.beforeUpdate(id, data);
      }

      await this.repository.update(id, data);
      const updatedEntity = await this.findById(id);

      await auditService.logChange({
        audit_entity_name: this.entityName,
        audit_action: AuditAction.UPDATE,
        audit_old_values: oldEntity,
        audit_new_values: data,
        audit_fk_user_id: user?.id,
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

      const user = this.getCurrentUser();

      if (this.hooks.beforeDelete) {
        await this.hooks.beforeDelete(id);
      }

      await this.repository.delete(id);

      await auditService.logChange({
        audit_entity_name: this.entityName,
        audit_action: AuditAction.DELETE,
        audit_old_values: entity,
        audit_fk_user_id: user?.id,
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
      created_at: "DESC",
    }) as FindOptionsOrder<T>;

    const relations = this.getRelationFields();

    return this.repository.findAndCount({
      where,
      skip,
      take: limit,
      order,
      relations,
    });
  }

  async search(options: SearchOptions = {}): Promise<[T[], number]> {
    const {
      page = 1,
      limit = 10,
      searchFields = [],
      searchTerm = "",
      order = { created_at: "DESC" as const },
    } = options;

    const skip = (page - 1) * limit;
    const relations = this.getRelationFields();

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
      relations,
    });
  }

  async count(
    where: FindOptionsWhere<T> | FindOptionsWhere<T>[] = {}
  ): Promise<number> {
    return this.repository.count({ where });
  }

  async clone(id: number, overrideData?: DeepPartial<T>): Promise<T> {
    try {
      const originalEntity = await this.findById(id);
      if (!originalEntity) {
        throw new Error(`Entity with ID ${id} not found`);
      }

      const user = this.getCurrentUser();

      const cloneData = {
        ...originalEntity,
        id: undefined,
        created_at: undefined,
        updated_at: undefined,
        ...overrideData,
      };

      const entity = this.repository.create(cloneData);
      const savedEntity = await this.repository.save(entity);

      await auditService.logChange({
        audit_entity_name: this.entityName,
        audit_action: AuditAction.CREATE,
        audit_new_values: cloneData,
        audit_fk_user_id: user?.id,
        audit_observation: `Cloned from ${this.entityName} ID: ${id}`,
      });

      return savedEntity;
    } catch (error) {
      throw new Error(`Clone operation failed: ${error.message}`);
    }
  }
}
