import { ReportOptions } from '@core/reports/report.service';
import { ApiResponseBuilder, PaginationOptions } from '@core/utils/api-response.util';
import { NotFoundError, ValidationError } from '@core/utils/errors.util';
import {
  filterNonAddableFields,
  filterNonBrowsableFields,
  filterNonEditableFields,
  filterNonReadableFields
} from '@core/utils/field-filter.util';
import { logger } from '@core/utils/logger';
import { IBaseModel } from '@modules/base/base.model';
import { BaseService, SearchOptions, SelectPickerOptions } from '@modules/base/base.service';
// import genericRoutes, { RouteSchema } from '@utils/route-schema.decorator';
import { instanceToPlain } from 'class-transformer';
import { FastifyReply, FastifyRequest } from 'fastify';
import i18next from 'i18next';
import { DeepPartial } from 'typeorm';
import { validate as isUUID } from 'uuid';

/**
 * Base controller class that provides common CRUD operations and utility methods
 * @template T - Type extending IBaseModel
 */
export class BaseController<T extends IBaseModel> {
  /**
   * Creates an instance of BaseController
   * @param service - The base service instance
   */
  constructor(protected service: BaseService<T>) { }

  /**
   * Sets the service context with user and token information
   * @param request - The Fastify request object
   */
  protected setServiceContext(request: FastifyRequest) {
    this.service.setContext({
      user: request.user,
      token: request.token
    });
  }

  /**
   * Validates required fields based on entity metadata
   * @param data - The data object to validate
   * @throws {ValidationError} If required fields are missing
   */
  protected validateRequiredFields(data: DeepPartial<T>) {
    const entityType = this.service.getEntityType();
    const metadata = Reflect.getMetadata('fieldConfig', entityType.prototype) || {};

    const missingFields: string[] = [];

    for (const [fieldName, config] of Object.entries(metadata)) {
      const fieldConfig = config as any;
      if (
        fieldConfig.required &&
        (!data ||
          data[fieldName] === undefined ||
          data[fieldName] === null ||
          data[fieldName] === '')
      ) {
        missingFields.push(fieldConfig.label || fieldName);
      }
    }

    if (missingFields.length > 0) {
      throw new ValidationError(i18next.t('REQUIRED_FIELDS', { fields: missingFields.join(', ') }));
    }
  }

  /**
   * Retrieves all items with pagination
   * @param request - The Fastify request object containing pagination options
   * @param reply - The Fastify reply object
   * @returns Promise with filtered items and pagination metadata
   */
  async findAll(request: FastifyRequest<{ Querystring: PaginationOptions }>, reply: FastifyReply) {
    try {
      const options = request.query;
      const [items, total] = await this.service.findAll(options);

      const filteredItems = filterNonBrowsableFields(items, this.service.getEntityType());
      const meta = ApiResponseBuilder.buildPaginationMeta(total, options);

      return reply.send(ApiResponseBuilder.success(filteredItems, meta));
    } catch (error) {
      return reply
        .status(500)
        .send(
          ApiResponseBuilder.error(
            'FIND_ALL_ERROR',
            i18next.t('FIND_ALL_ERROR'),
            error instanceof Error ? error.stack : undefined
          )
        );
    }
  }

  /**
   * Retrieves an item by its ID
   * @param request - The Fastify request object containing the item ID
   * @param reply - The Fastify reply object
   * @returns Promise with the found item
   * @throws {ValidationError} If the ID is not a valid UUID
   * @throws {NotFoundError} If the item is not found
   */
  async findById(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const id = request.params.id;

    if (!isUUID(id)) {
      throw new ValidationError(i18next.t('INVALID_UUID'));
    }

    const item = await this.service.findById(id);

    if (!item) {
      throw new NotFoundError(this.service.getModelName(), id);
    }

    const filteredItem = filterNonReadableFields(item, this.service.getEntityType());
    return reply.send(ApiResponseBuilder.success(filteredItem));
  }

  /**
   * Creates a new item
   * @param request - The Fastify request object containing the item data
   * @param reply - The Fastify reply object
   * @returns Promise with the created item
   * @throws {ValidationError} If required fields are missing
   */
  async create(
    request: FastifyRequest<{ Body: Partial<T> & Record<string, unknown> }>,
    reply: FastifyReply
  ) {
    try {
      this.setServiceContext(request);

      const filteredData = filterNonAddableFields(
        request.body as DeepPartial<T>,
        this.service.getEntityType()
      );

      this.validateRequiredFields(filteredData);

      const newItem = await this.service.create(filteredData);
      return reply
        .status(201)
        .send(ApiResponseBuilder.success(instanceToPlain(newItem), undefined));
    } catch (error) {
      if (error instanceof ValidationError) {
        return reply.status(400).send(ApiResponseBuilder.error('VALIDATION_ERROR', error.message));
      }
      return reply
        .status(500)
        .send(
          ApiResponseBuilder.error(
            'CREATE_FAILED',
            i18next.t('CREATE_FAILED'),
            error instanceof Error ? error.stack : undefined
          )
        );
    }
  }

  /**
   * Updates an existing item
   * @param request - The Fastify request object containing the item ID and update data
   * @param reply - The Fastify reply object
   * @returns Promise with the updated item
   * @throws {ValidationError} If the ID is not a valid UUID or required fields are missing
   */
  async update(
    request: FastifyRequest<{
      Params: { id: string };
      Body: Partial<T> & Record<string, unknown>;
    }>,
    reply: FastifyReply
  ) {
    try {
      const id = request.params.id;
      if (!isUUID(id)) {
        throw new ValidationError(i18next.t('INVALID_UUID'));
      }

      const filteredData = filterNonEditableFields(
        request.body as DeepPartial<T>,
        this.service.getEntityType()
      );

      this.validateRequiredFields(filteredData);

      const updatedItem = await this.service.update(id, filteredData as any);

      if (!updatedItem) {
        return reply
          .status(404)
          .send(ApiResponseBuilder.error('ITEM_NOT_FOUND', i18next.t('ITEM_NOT_FOUND', { id })));
      }

      return reply.send(ApiResponseBuilder.success(instanceToPlain(updatedItem)));
    } catch (error) {
      if (error instanceof ValidationError) {
        return reply.status(400).send(ApiResponseBuilder.error('VALIDATION_ERROR', error.message));
      }
      return reply
        .status(500)
        .send(
          ApiResponseBuilder.error(
            'UPDATE_FAILED',
            i18next.t('UPDATE_FAILED'),
            error instanceof Error ? error.stack : undefined
          )
        );
    }
  }

  /**
   * Deletes an item by its ID
   * @param request - The Fastify request object containing the item ID
   * @param reply - The Fastify reply object
   * @returns Promise with no content on success
   */
  async delete(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const id = parseInt(request.params.id);
      await this.service.delete(id);
      return reply.status(204).send();
    } catch (error) {
      return reply
        .status(500)
        .send(
          ApiResponseBuilder.error(
            'DELETE_FAILED',
            i18next.t('UNABLE_TO_DELETE', { id: request.params.id }),
            error instanceof Error ? error.stack : undefined
          )
        );
    }
  }

  /**
   * Finds items based on provided conditions
   * @param request - The Fastify request object containing search conditions and pagination options
   * @param reply - The Fastify reply object
   * @returns Promise with filtered items and pagination metadata
   */
  async findByConditions(
    request: FastifyRequest<{
      Querystring: PaginationOptions & Record<string, any>;
    }>,
    reply: FastifyReply
  ) {
    try {
      const { page, limit, order, ...whereConditions } = request.query;
      const options = { page, limit, order };

      const [items, total] = await this.service.findByConditions(whereConditions as any, options);

      const meta = ApiResponseBuilder.buildPaginationMeta(total, options);
      return reply.send(ApiResponseBuilder.success(items, meta));
    } catch (error) {
      return reply
        .status(500)
        .send(
          ApiResponseBuilder.error(
            'INTERNAL_SERVER_ERROR',
            i18next.t('UNABLE_TO_FETCH_FILTERED'),
            error instanceof Error ? error.message : undefined
          )
        );
    }
  }

  /**
   * Searches items based on search term and fields
   * @param request - The Fastify request object containing search options
   * @param reply - The Fastify reply object
   * @returns Promise with search results and pagination metadata
   */
  async search(
    request: FastifyRequest<{
      Querystring: SearchOptions & { searchFields?: string };
    }>,
    reply: FastifyReply
  ) {
    try {
      const { searchFields, searchTerm, ...paginationOptions } = request.query;

      const searchFieldsArray = searchFields ? searchFields.split(',') : [];

      const options: SearchOptions = {
        ...paginationOptions,
        searchFields: searchFieldsArray,
        searchTerm
      };

      const [items, total] = await this.service.search(options);
      const meta = ApiResponseBuilder.buildPaginationMeta(total, options);

      return reply.send(ApiResponseBuilder.success(instanceToPlain(items), meta));
    } catch (error) {
      return reply
        .status(500)
        .send(
          ApiResponseBuilder.error(
            'SEARCH_FAILED',
            i18next.t('SEARCH_FAILED'),
            error instanceof Error ? error.message : undefined
          )
        );
    }
  }

  /**
   * Counts items based on provided conditions
   * @param request - The Fastify request object containing count conditions
   * @param reply - The Fastify reply object
   * @returns Promise with the count result
   */
  async count(
    request: FastifyRequest<{
      Querystring: Record<string, any>;
    }>,
    reply: FastifyReply
  ) {
    try {
      const whereConditions = request.query;
      const count = await this.service.count(whereConditions as any);

      return reply.send(ApiResponseBuilder.success({ count }));
    } catch (error) {
      return reply
        .status(500)
        .send(
          ApiResponseBuilder.error(
            'COUNT_FAILED',
            i18next.t('COUNT_FAILED'),
            error instanceof Error ? error.message : undefined
          )
        );
    }
  }

  /**
   * Clones an existing item with optional override data
   * @param request - The Fastify request object containing the item ID and override data
   * @param reply - The Fastify reply object
   * @returns Promise with the cloned item
   * @throws {ValidationError} If the ID is not a valid UUID
   */
  async clone(
    request: FastifyRequest<{
      Params: { id: string };
      Body: DeepPartial<T>;
    }>,
    reply: FastifyReply
  ) {
    try {
      this.setServiceContext(request);

      const id = request.params.id;
      if (!isUUID(id)) {
        throw new ValidationError(i18next.t('INVALID_UUID'));
      }

      const overrideData = request.body as DeepPartial<T>;

      const clonedItem = await this.service.clone(id, overrideData);

      return reply.status(201).send(ApiResponseBuilder.success(instanceToPlain(clonedItem)));
    } catch (error) {
      return reply
        .status(500)
        .send(
          ApiResponseBuilder.error(
            'CLONE_FAILED',
            i18next.t('CLONE_FAILED'),
            error instanceof Error ? error.stack : undefined
          )
        );
    }
  }

  /**
   * Retrieves select options for the entity
   * @param request - The Fastify request object containing select options parameters
   * @param reply - The Fastify reply object
   * @returns Promise with select options
   */
  async getSelectOptions(
    request: FastifyRequest<{
      Querystring: {
        labelFields?: string;
        delimiter?: string;
        search?: string;
      };
    }>,
    reply: FastifyReply
  ) {
    try {
      const { labelFields, delimiter, search } = request.query;

      const options: SelectPickerOptions = {
        labelFields: labelFields?.split(','),
        delimiter,
        searchTerm: search
      };

      const selectOptions = await this.service.getSelectOptions(options);
      return reply.send(ApiResponseBuilder.success(selectOptions));
    } catch (error) {
      return reply
        .status(500)
        .send(
          ApiResponseBuilder.error(
            'SELECT_OPTIONS_FAILED',
            i18next.t('SELECT_OPTIONS_FAILED'),
            error instanceof Error ? error.stack : undefined
          )
        );
    }
  }

  /**
   * Retrieves available fields for the entity
   * @param request - The Fastify request object
   * @param reply - The Fastify reply object
   * @returns Promise with available fields
   */
  async getFields(request: FastifyRequest, reply: FastifyReply) {
    console.log("aaa")
    try {
      const fields = this.service.getFields();
      return reply.send(ApiResponseBuilder.success(fields));
    } catch (error) {
      return reply
        .status(500)
        .send(
          ApiResponseBuilder.error(
            'FIELDS_FETCH_FAILED',
            i18next.t('FIELDS_FETCH_FAILED'),
            error instanceof Error ? error.stack : undefined
          )
        );
    }
  }

  /**
   * Generates a report based on provided options
   * @param request - The Fastify request object containing report options
   * @param reply - The Fastify reply object
   * @returns Promise with the generated report path
   */
  async generateReport(
    request: FastifyRequest<{
      Querystring: ReportOptions;
    }>,
    reply: FastifyReply
  ): Promise<string> {
    try {
      const pdfPath = await this.service.generateReport(request.query);
      return reply.send(ApiResponseBuilder.success(pdfPath));
    } catch (error) {
      logger.error('Error generating project report', { error });
      return reply
        .status(500)
        .send(
          ApiResponseBuilder.error(
            'REPORT_GENERATION_FAILED',
            i18next.t('REPORT_GENERATION_FAILED', 'Failed to generate project report')
          )
        );
    }
  }
}
