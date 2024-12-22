import { ReportOptions } from '@core/reports/report.service';
import { ApiResponseBuilder, PaginationOptions } from '@core/utils/api-response.util';
import { NotFoundError, ValidationError } from '@core/utils/errors.util';
import { logger } from '@core/utils/logger';
import { IBaseModel } from '@modules/base/base.model';
import { BaseService, SearchOptions, SelectPickerOptions } from '@modules/base/base.service';
// import genericRoutes, { RouteSchema } from '@utils/route-schema.decorator';
import { FastifyReply, FastifyRequest } from 'fastify';
import i18next from 'i18next';
import { DeepPartial } from 'typeorm';

export class BaseController<T extends IBaseModel> {
  constructor(protected service: BaseService<T>) {}

  protected setServiceContext(request: FastifyRequest) {
    this.service.setContext({
      user: request.user,
      token: request.token,
    });
  }

  // @RouteSchema(genericRoutes.findAll)
  async findAll(request: FastifyRequest<{ Querystring: PaginationOptions }>, reply: FastifyReply) {
    try {
      const options = request.query;
      const [items, total] = await this.service.findAll(options);

      const meta = ApiResponseBuilder.buildPaginationMeta(total, options);
      return reply.send(ApiResponseBuilder.success(items, meta));
    } catch (error) {
      return reply
        .status(500)
        .send(
          ApiResponseBuilder.error(
            'FIND_ALL_ERROR',
            i18next.t('FIND_ALL_ERROR'),
            error instanceof Error ? error.stack : undefined,
          ),
        );
    }
  }

  async findById(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const id = parseInt(request.params.id);

    if (isNaN(id)) {
      throw new ValidationError('The provided ID must be a valid number');
    }

    const item = await this.service.findById(id);

    if (!item) {
      throw new NotFoundError(this.service.getModelName(), id);
    }

    return reply.send(ApiResponseBuilder.success(item));
  }

  async create(
    request: FastifyRequest<{ Body: Partial<T> & Record<string, unknown> }>,
    reply: FastifyReply,
  ) {
    try {
      this.setServiceContext(request);
      const newItem = await this.service.create(request.body as DeepPartial<T>);
      return reply.status(201).send(ApiResponseBuilder.success(newItem, undefined));
    } catch (error) {
      return reply
        .status(500)
        .send(
          ApiResponseBuilder.error(
            'CREATE_FAILED',
            i18next.t('CREATE_FAILED'),
            error instanceof Error ? error.stack : undefined,
          ),
        );
    }
  }

  async update(
    request: FastifyRequest<{
      Params: { id: string };
      Body: Partial<T> & Record<string, unknown>;
    }>,
    reply: FastifyReply,
  ) {
    try {
      const id = parseInt(request.params.id);
      const updatedItem = await this.service.update(id, request.body as any);

      if (!updatedItem) {
        return reply
          .status(404)
          .send(ApiResponseBuilder.error('ITEM_NOT_FOUND', i18next.t('ITEM_NOT_FOUND', { id })));
      }

      return reply.send(ApiResponseBuilder.success(updatedItem));
    } catch (error) {
      return reply
        .status(500)
        .send(
          ApiResponseBuilder.error(
            'UPDATE_FAILED',
            i18next.t('UPDATE_FAILED'),
            error instanceof Error ? error.stack : undefined,
          ),
        );
    }
  }

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
            `Unable to delete item with ID ${request.params.id}.`,
            error instanceof Error ? error.stack : undefined,
          ),
        );
    }
  }

  async findByConditions(
    request: FastifyRequest<{
      Querystring: PaginationOptions & Record<string, any>;
    }>,
    reply: FastifyReply,
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
            'Unable to fetch filtered items',
            error instanceof Error ? error.message : undefined,
          ),
        );
    }
  }

  async search(
    request: FastifyRequest<{
      Querystring: SearchOptions & { searchFields?: string };
    }>,
    reply: FastifyReply,
  ) {
    try {
      const { searchFields, searchTerm, ...paginationOptions } = request.query;

      const searchFieldsArray = searchFields ? searchFields.split(',') : [];

      const options: SearchOptions = {
        ...paginationOptions,
        searchFields: searchFieldsArray,
        searchTerm,
      };

      const [items, total] = await this.service.search(options);
      const meta = ApiResponseBuilder.buildPaginationMeta(total, options);

      return reply.send(ApiResponseBuilder.success(items, meta));
    } catch (error) {
      return reply
        .status(500)
        .send(
          ApiResponseBuilder.error(
            'SEARCH_FAILED',
            i18next.t('SEARCH_FAILED'),
            error instanceof Error ? error.message : undefined,
          ),
        );
    }
  }

  async count(
    request: FastifyRequest<{
      Querystring: Record<string, any>;
    }>,
    reply: FastifyReply,
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
            'Unable to count items',
            error instanceof Error ? error.message : undefined,
          ),
        );
    }
  }

  async clone(
    request: FastifyRequest<{
      Params: { id: string };
      Body: DeepPartial<T>;
    }>,
    reply: FastifyReply,
  ) {
    try {
      this.setServiceContext(request);
      const id = Number(request.params.id);
      const overrideData = request.body as DeepPartial<T>;

      const clonedItem = await this.service.clone(id, overrideData);

      return reply.status(201).send(ApiResponseBuilder.success(clonedItem));
    } catch (error) {
      return reply
        .status(500)
        .send(
          ApiResponseBuilder.error(
            'CLONE_FAILED',
            'Unable to clone the item',
            error instanceof Error ? error.stack : undefined,
          ),
        );
    }
  }

  async getSelectOptions(
    request: FastifyRequest<{
      Querystring: {
        labelFields?: string;
        delimiter?: string;
        search?: string;
      };
    }>,
    reply: FastifyReply,
  ) {
    try {
      const { labelFields, delimiter, search } = request.query;

      const options: SelectPickerOptions = {
        labelFields: labelFields?.split(','),
        delimiter,
        searchTerm: search,
      };

      const selectOptions = await this.service.getSelectOptions(options);
      return reply.send(ApiResponseBuilder.success(selectOptions));
    } catch (error) {
      return reply
        .status(500)
        .send(
          ApiResponseBuilder.error(
            'SELECT_OPTIONS_FAILED',
            'Unable to fetch select options',
            error instanceof Error ? error.stack : undefined,
          ),
        );
    }
  }

  async getFields(request: FastifyRequest, reply: FastifyReply) {
    try {
      const fields = this.service.getFields();
      return reply.send(ApiResponseBuilder.success(fields));
    } catch (error) {
      return reply
        .status(500)
        .send(
          ApiResponseBuilder.error(
            'FIELDS_FETCH_FAILED',
            'Unable to fetch entity fields',
            error instanceof Error ? error.stack : undefined,
          ),
        );
    }
  }

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
      console.error(error);
      logger.error('Error generating project report', { error });
      return reply
        .status(500)
        .send(
          ApiResponseBuilder.error('REPORT_GENERATION_FAILED', 'Failed to generate project report'),
        );
    }
  }
}
