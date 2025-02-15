import {
  FieldConfigOptions,
  FormConfig,
  getFieldConfigs,
  getFormConfig,
} from '@core/decorators/field-config.decorator';
import { ReportOptions, ReportService } from '@core/reports/report.service';
import { PaginationOptions } from '@core/utils/api-response.util';
import { AuditAction } from '@modules/audits/audit.model';
import { auditService } from '@modules/audits/audit.service';
import { IBaseModel } from '@modules/base/base.model';
import { User } from '@modules/users/user.model';
import { DeepPartial, FindOptionsOrder, FindOptionsWhere, ILike, Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

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
  defineRelationFields?(): string[];
}

export interface ServiceContext {
  user?: User;
  token?: string;
}

interface SelectOption {
  value: number;
  label: string;
}

export interface SelectPickerOptions {
  labelFields?: string[];
  delimiter?: string;
  searchTerm?: string;
}

export class BaseService<T extends IBaseModel> {
  protected hooks: IServiceHooks<T> = {};
  protected context: ServiceContext = {};

  constructor(
    protected repository: Repository<T>,
    protected modelName: string,
  ) {}

  public getModelName(): string {
    return this.modelName;
  }

  public getFields(): { config: FormConfig; fields: Record<string, FieldConfigOptions> } {
    const entityClass = this.repository.target;

    const fieldConfigs = getFieldConfigs(entityClass);
    const formConfig = getFormConfig(entityClass);

    return {
      config: formConfig,
      fields: fieldConfigs,
    };
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
    if (this.hooks.defineRelationFields) {
      return this.hooks.defineRelationFields();
    }

    const relations: string[] = [];
    const metadata = this.repository.metadata;
    const processedPaths = new Set<string>();

    const processRelations = (prefix: string = '') => {
      const relationsToProcess = prefix
        ? metadata.findRelationWithPropertyPath(prefix)?.inverseEntityMetadata.relations
        : metadata.relations;

      relationsToProcess?.forEach(relation => {
        const fullPath = prefix ? `${prefix}.${relation.propertyName}` : relation.propertyName;

        if (processedPaths.has(fullPath)) return;
        processedPaths.add(fullPath);

        const hasForeignKey = metadata.columns.some(
          column =>
            column.propertyName.includes('_fk_') &&
            (prefix === ''
              ? column.propertyName.includes(relation.propertyName)
              : column.propertyName.includes(relation.propertyName) ||
                column.propertyName.includes(prefix.split('.').pop() || '')),
        );

        if (hasForeignKey) {
          relations.push(fullPath);
          processRelations(fullPath);
        }
      });
    };

    processRelations();
    return relations;
  }

  async findAll(options: PaginationOptions = {}): Promise<[T[], number]> {
    const page = options.page || 1;
    const limit = options.limit || 10;
    const skip = (page - 1) * limit;
    const order = (options.order || {
      created_at: 'DESC',
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

      const entity = this.repository.create({
        ...data,
        created_by_fk_user_id: user?.id,
      } as DeepPartial<T>);

      const savedEntity = await this.repository.save(entity);

      await auditService.logChange({
        audit_entity_name: this.modelName,
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

      await this.repository.update(id, {
        ...data,
        updated_by_fk_user_id: user?.id,
      } as QueryDeepPartialEntity<T>);

      const updatedEntity = await this.findById(id);

      await auditService.logChange({
        audit_entity_name: this.modelName,
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
        audit_entity_name: this.modelName,
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
    options: PaginationOptions = {},
  ): Promise<[T[], number]> {
    const page = options.page || 1;
    const limit = options.limit || 10;
    const skip = (page - 1) * limit;
    const order = (options.order || {
      created_at: 'DESC',
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
      searchTerm = '',
      order = { created_at: 'DESC' as const },
    } = options;

    const skip = (page - 1) * limit;
    const relations = this.getRelationFields();

    if (!searchTerm) {
      return this.findAll(options);
    }

    let fieldsToSearch: string[] = [];

    if (searchFields.length === 0) {
      fieldsToSearch = this.repository.metadata.columns
        .filter(column => {
          const type =
            typeof column.type === 'string'
              ? column.type.toLowerCase()
              : (column.type as Function).name.toLowerCase();

          const textTypes = ['varchar', 'character varying', 'text'];
          return textTypes.includes(type);
        })
        .map(column => column.propertyName);
    } else {
      fieldsToSearch = searchFields;
    }

    const whereConditions = fieldsToSearch.map(field => ({
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

  async count(where: FindOptionsWhere<T> | FindOptionsWhere<T>[] = {}): Promise<number> {
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
        audit_entity_name: this.modelName,
        audit_action: AuditAction.CREATE,
        audit_new_values: cloneData,
        audit_fk_user_id: user?.id,
        audit_observation: `Cloned from ${this.modelName} ID: ${id}`,
      });

      return savedEntity;
    } catch (error) {
      throw new Error(`Clone operation failed: ${error.message}`);
    }
  }

  async getSelectOptions(options: SelectPickerOptions = {}): Promise<SelectOption[]> {
    try {
      const metadata = this.repository.metadata;

      let labelFields = options.labelFields;
      if (!labelFields) {
        const nameField = metadata.columns.find(column =>
          column.propertyName.endsWith('_name'),
        )?.propertyName;

        if (nameField) {
          labelFields = [nameField];
        } else {
          const firstField = metadata.columns.find(
            column => column.propertyName !== 'id',
          )?.propertyName;

          if (firstField) {
            labelFields = [firstField];
          }
        }
      }

      if (!labelFields || labelFields.length === 0) {
        throw new Error('No suitable fields found for label');
      }

      let whereConditions = {};
      if (options.searchTerm) {
        whereConditions = labelFields.map(field => ({
          [field]: ILike(`%${options.searchTerm}%`),
        }));
      }

      const entities = await this.repository.find({
        where: options.searchTerm ? whereConditions : undefined,
        take: 100,
      });

      const delimiter = options.delimiter || ' - ';

      return entities.map(entity => ({
        value: entity.id,
        label: labelFields
          .map(field => entity[field])
          .filter(Boolean)
          .join(delimiter),
      }));
    } catch (error) {
      throw new Error(`Failed to get select options: ${error.message}`);
    }
  }

  async generateReport(options: ReportOptions = {}): Promise<string> {
    try {
      return ReportService.generateReport(this, options);
    } catch (error) {
      throw new Error(`Failed to generate report: ${error.message}`);
    }
  }
}
