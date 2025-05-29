import {
  FieldConfigOptions,
  FormConfig,
  getFieldConfigs,
  getFormConfig
} from '@core/decorators/field-config.decorator';
import { AuditAction } from '@core/enums/audit-action.enum';
import { ReportOptions, ReportService } from '@core/reports/report.service';
import { PaginationOptions } from '@core/utils/api-response.util';
import { auditService } from '@modules/audits/audit.service';
import { IBaseModel } from '@modules/base/base.model';
import { User } from '@modules/users/user.model';
import i18next from 'i18next';
import { DeepPartial, FindOptionsOrder, FindOptionsWhere, ILike, Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { validate as isUUID } from 'uuid';

type WhereConditions<T> = FindOptionsWhere<T>;

export interface SearchOptions extends PaginationOptions {
  searchFields?: string[];
  searchTerm?: string;
}

/**
 * Interface for service hooks that can be implemented to add custom behavior
 * @template T - Type extending IBaseModel
 */
export interface IServiceHooks<T> {
  /**
   * Hook executed before creating an entity
   * @param data - The data to be used for entity creation
   */
  beforeCreate?(data: DeepPartial<T>): Promise<void>;
  /**
   * Hook executed after creating an entity
   * @param entity - The created entity
   */
  afterCreate?(entity: T): Promise<void>;
  /**
   * Hook executed before updating an entity
   * @param id - The ID of the entity to update
   * @param data - The data to update the entity with
   */
  beforeUpdate?(id: number, data: QueryDeepPartialEntity<T>): Promise<void>;
  /**
   * Hook executed after updating an entity
   * @param entity - The updated entity
   */
  afterUpdate?(entity: T): Promise<void>;
  /**
   * Hook executed before deleting an entity
   * @param id - The ID of the entity to delete
   */
  beforeDelete?(id: number): Promise<void>;
  /**
   * Hook executed after deleting an entity
   * @param entity - The deleted entity
   */
  afterDelete?(entity: T): Promise<void>;
  /**
   * Hook to define custom relation fields
   * @param defaultRelations - The default relations array
   * @returns Array of relation field names
   */
  defineRelationFields?(defaultRelations): string[];
}

/**
 * Interface for service context containing user and token information
 */
export interface ServiceContext {
  /** The current user */
  user?: User;
  /** The current authentication token */
  token?: string;
}

/**
 * Interface for select option items
 */
interface SelectOption {
  /** The value of the option */
  value: number;
  /** The label to display */
  label: string;
}

/**
 * Interface for select picker options
 */
export interface SelectPickerOptions {
  /** Fields to use for the label */
  labelFields?: string[];
  /** Delimiter to use between label fields */
  delimiter?: string;
  /** Search term to filter options */
  searchTerm?: string;
}

/**
 * Base service class that provides common CRUD operations and utility methods
 * @template T - Type extending IBaseModel
 */
export class BaseService<T extends IBaseModel> {
  /** Service hooks for custom behavior */
  protected hooks: IServiceHooks<T> = {};
  /** Service context containing user and token information */
  protected context: ServiceContext = {};

  /**
   * Creates an instance of BaseService
   * @param repository - The TypeORM repository instance
   * @param modelName - The name of the model
   */
  constructor(
    protected repository: Repository<T>,
    protected modelName: string
  ) {}

  /**
   * Gets the model name
   * @returns The model name
   */
  public getModelName(): string {
    return this.modelName;
  }

  /**
   * Gets the form configuration and field configurations
   * @returns Object containing form config and field configs
   */
  public getFields(): { config: FormConfig; fields: Record<string, FieldConfigOptions> } {
    const entityClass = this.repository.target;

    const fieldConfigs = getFieldConfigs(entityClass);
    const formConfig = getFormConfig(entityClass);

    return {
      config: formConfig,
      fields: fieldConfigs
    };
  }

  /**
   * Sets the service hooks
   * @param hooks - The hooks to set
   */
  setHooks(hooks: IServiceHooks<T>) {
    this.hooks = hooks;
  }

  /**
   * Sets the service context
   * @param context - The context to set
   */
  setContext(context: ServiceContext) {
    this.context = context;
  }

  /**
   * Gets the current user from context
   * @returns The current user or undefined
   */
  protected getCurrentUser(): User | undefined {
    return this.context.user;
  }

  /**
   * Gets the relation fields for the entity
   * @returns Array of relation field names
   */
  private getRelationFields(): string[] {
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
                column.propertyName.includes(prefix.split('.').pop() || ''))
        );

        if (hasForeignKey) {
          relations.push(fullPath);
          processRelations(fullPath);
        }
      });
    };

    processRelations();

    if (this.hooks.defineRelationFields) {
      return this.hooks.defineRelationFields(relations);
    }

    return relations;
  }

  /**
   * Finds all entities with pagination
   * @param options - Pagination options
   * @returns Promise with array of entities and total count
   */
  async findAll(options: PaginationOptions = {}): Promise<[T[], number]> {
    const page = options.page || 1;
    const limit = options.limit || 10;
    const skip = (page - 1) * limit;
    const order = (options.order || {
      created_at: 'DESC'
    }) as FindOptionsOrder<T>;

    const relations = this.getRelationFields();

    return this.repository.findAndCount({
      skip,
      take: limit,
      order,
      relations
    });
  }

  /**
   * Finds an entity by ID
   * @param id - The ID or UUID of the entity
   * @returns Promise with the found entity or null
   */
  async findById(id: number | string): Promise<T | null> {
    const relations = this.getRelationFields();

    if (typeof id === 'string' && isUUID(id)) {
      return this.repository.findOne({
        where: { uuid: id } as any,
        relations
      });
    } else {
      return this.repository.findOne({
        where: { id } as any,
        relations
      });
    }
  }

  /**
   * Creates a new entity
   * @param data - The data to create the entity with
   * @returns Promise with the created entity
   * @throws Error if creation fails
   */
  async create(data: DeepPartial<T>): Promise<T> {
    try {
      const user = this.getCurrentUser();

      if (this.hooks.beforeCreate) {
        await this.hooks.beforeCreate(data);
      }

      const entity = this.repository.create({
        ...data,
        created_by_fk_user_id: user?.id
      } as DeepPartial<T>);

      const savedEntity = await this.repository.save(entity);

      await auditService.logChange({
        audit_entity_name: this.modelName,
        audit_action: AuditAction.CREATE,
        audit_new_values: data,
        created_by_fk_user_id: user.id
      });

      if (this.hooks.afterCreate) {
        await this.hooks.afterCreate(savedEntity);
      }

      return savedEntity;
    } catch (error) {
      throw new Error(i18next.t('CREATE_OPERATION_FAILED', { message: error.message }));
    }
  }

  /**
   * Updates an existing entity
   * @param id - The ID or UUID of the entity to update
   * @param data - The data to update the entity with
   * @returns Promise with the updated entity or null
   * @throws Error if update fails
   */
  async update(id: number | string, data: QueryDeepPartialEntity<T>): Promise<T | null> {
    try {
      const oldEntity = await this.findById(id);
      if (!oldEntity) return null;

      const user = this.getCurrentUser();

      if (this.hooks.beforeUpdate) {
        await this.hooks.beforeUpdate(oldEntity.id, data);
      }

      await this.repository.update(oldEntity.id, {
        ...data,
        updated_by_fk_user_id: user?.id
      } as QueryDeepPartialEntity<T>);

      const updatedEntity = await this.findById(id);

      await auditService.logChange({
        audit_entity_name: this.modelName,
        audit_action: AuditAction.UPDATE,
        audit_old_values: oldEntity,
        audit_new_values: data,
        created_by_fk_user_id: user.id
      });

      if (this.hooks.afterUpdate && updatedEntity) {
        await this.hooks.afterUpdate(updatedEntity);
      }

      return updatedEntity;
    } catch (error) {
      throw new Error(i18next.t('UPDATE_OPERATION_FAILED', { message: error.message }));
    }
  }

  /**
   * Deletes an entity
   * @param id - The ID of the entity to delete
   * @throws Error if deletion fails
   */
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
        created_by_fk_user_id: user.id
      });

      if (this.hooks.afterDelete) {
        await this.hooks.afterDelete(entity);
      }
    } catch (error) {
      throw new Error(i18next.t('DELETE_OPERATION_FAILED', { message: error.message }));
    }
  }

  /**
   * Finds entities based on conditions
   * @param where - The where conditions
   * @param options - Pagination options
   * @returns Promise with array of entities and total count
   */
  async findByConditions(
    where: WhereConditions<T>,
    options: PaginationOptions = {}
  ): Promise<[T[], number]> {
    const page = options.page || 1;
    const limit = options.limit || 10;
    const skip = (page - 1) * limit;
    const order = (options.order || {
      created_at: 'DESC'
    }) as FindOptionsOrder<T>;

    const relations = this.getRelationFields();

    return this.repository.findAndCount({
      where,
      skip,
      take: limit,
      order,
      relations
    });
  }

  /**
   * Searches entities based on search term and fields
   * @param options - Search options including pagination and search parameters
   * @returns Promise with array of entities and total count
   */
  async search(options: SearchOptions = {}): Promise<[T[], number]> {
    const {
      page = 1,
      limit = 10,
      searchFields = [],
      searchTerm = '',
      order = { created_at: 'DESC' as const }
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
      [field]: ILike(`%${searchTerm}%`)
    })) as FindOptionsWhere<T>[];

    return this.repository.findAndCount({
      where: whereConditions,
      skip,
      take: limit,
      order: order as FindOptionsOrder<T>,
      relations
    });
  }

  /**
   * Counts entities based on conditions
   * @param where - The where conditions
   * @returns Promise with the count
   */
  async count(where: FindOptionsWhere<T> | FindOptionsWhere<T>[] = {}): Promise<number> {
    return this.repository.count({ where });
  }

  /**
   * Clones an existing entity
   * @param id - The ID or UUID of the entity to clone
   * @param overrideData - Optional data to override in the clone
   * @returns Promise with the cloned entity
   * @throws Error if cloning fails
   */
  async clone(id: number | string, overrideData?: DeepPartial<T>): Promise<T> {
    try {
      const originalEntity = await this.findById(id);
      if (!originalEntity) {
        throw new Error(i18next.t('ITEM_NOT_FOUND', { id }));
      }

      const user = this.getCurrentUser();

      const cloneData = {
        ...originalEntity,
        id: undefined,
        uuid: undefined,
        created_at: undefined,
        updated_at: undefined,
        ...overrideData
      };

      const entity = this.repository.create(cloneData);
      const savedEntity = await this.repository.save(entity);

      await auditService.logChange({
        audit_entity_name: this.modelName,
        audit_action: AuditAction.CREATE,
        audit_new_values: cloneData,
        created_by_fk_user_id: user.id,
        audit_observation: `Cloned from ${this.modelName} ID: ${id} (UUID: ${originalEntity.uuid})`
      });

      return savedEntity;
    } catch (error) {
      throw new Error(i18next.t('CLONE_FAILED'));
    }
  }

  /**
   * Gets select options for the entity
   * @param options - Select picker options
   * @returns Promise with array of select options
   * @throws Error if getting select options fails
   */
  async getSelectOptions(options: SelectPickerOptions = {}): Promise<SelectOption[]> {
    try {
      const metadata = this.repository.metadata;

      let labelFields = options.labelFields;
      if (!labelFields) {
        const nameField = metadata.columns.find(column =>
          column.propertyName.endsWith('_name')
        )?.propertyName;

        if (nameField) {
          labelFields = [nameField];
        } else {
          const firstField = metadata.columns.find(
            column => column.propertyName !== 'id'
          )?.propertyName;

          if (firstField) {
            labelFields = [firstField];
          }
        }
      }

      if (!labelFields || labelFields.length === 0) {
        throw new Error(i18next.t('SELECT_OPTIONS_FAILED'));
      }

      let whereConditions = {};
      if (options.searchTerm) {
        whereConditions = labelFields.map(field => ({
          [field]: ILike(`%${options.searchTerm}%`)
        }));
      }

      const entities = await this.repository.find({
        where: options.searchTerm ? whereConditions : undefined,
        take: 100
      });

      const delimiter = options.delimiter || ' - ';

      return entities.map(entity => ({
        value: entity.id,
        label: labelFields
          .map(field => entity[field])
          .filter(Boolean)
          .join(delimiter)
      }));
    } catch (error) {
      throw new Error(i18next.t('SELECT_OPTIONS_FAILED'));
    }
  }

  /**
   * Generates a report based on options
   * @param options - Report options
   * @returns Promise with the generated report path
   * @throws Error if report generation fails
   */
  async generateReport(options: ReportOptions = {}): Promise<string> {
    try {
      return ReportService.generateReport(this, options);
    } catch (error) {
      throw new Error(i18next.t('REPORT_GENERATION_FAILED'));
    }
  }

  /**
   * Gets the entity type
   * @returns The entity type
   */
  getEntityType(): any {
    return this.repository.target;
  }
}
