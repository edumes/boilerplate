import { FastifyRequest, FastifyReply } from "fastify";
import { BaseService } from "./base.service";
import { ApiResponseBuilder } from "../../utils/api-response.util";
import { IBaseEntity } from "./base.entity";
import { PaginationOptions } from "../../utils/api-response.util";
import { DeepPartial } from "typeorm";

export class BaseController<T extends IBaseEntity> {
  constructor(protected service: BaseService<T>) {}

  async findAll(
    request: FastifyRequest<{ Querystring: PaginationOptions }>,
    reply: FastifyReply
  ) {
    try {
      const options = request.query;
      const [items, total] = await this.service.findAll(options);

      const meta = ApiResponseBuilder.buildPaginationMeta(total, options);
      const response = ApiResponseBuilder.success(items, meta);

      return reply.send(response);
    } catch (error) {
      const errorResponse = ApiResponseBuilder.error(
        "INTERNAL_SERVER_ERROR",
        "Internal server error",
        error instanceof Error ? error.message : undefined
      );
      return reply.status(500).send(errorResponse);
    }
  }

  async findById(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      const id = parseInt(request.params.id);
      const item = await this.service.findById(id);

      if (!item) {
        const errorResponse = ApiResponseBuilder.error(
          "ITEM_NOT_FOUND",
          "Item not found"
        );
        return reply.status(404).send(errorResponse);
      }

      return reply.send(ApiResponseBuilder.success(item));
    } catch (error) {
      const errorResponse = ApiResponseBuilder.error(
        "INTERNAL_SERVER_ERROR",
        "Internal server error",
        error instanceof Error ? error.message : undefined
      );
      return reply.status(500).send(errorResponse);
    }
  }

  async create(
    request: FastifyRequest<{ Body: Partial<T> & Record<string, unknown> }>,
    reply: FastifyReply
  ) {
    try {
      const newItem = await this.service.create(request.body as DeepPartial<T>);
      return reply.status(201).send(ApiResponseBuilder.success(newItem));
    } catch (error) {
      const errorResponse = ApiResponseBuilder.error(
        "INTERNAL_SERVER_ERROR",
        "Internal server error",
        error instanceof Error ? error.message : undefined
      );
      return reply.status(500).send(errorResponse);
    }
  }

  async update(
    request: FastifyRequest<{ Params: { id: string }; Body: Partial<T> & Record<string, unknown> }>,
    reply: FastifyReply
  ) {
    try {
      const id = parseInt(request.params.id);
      const updatedItem = await this.service.update(id, request.body as any);

      if (!updatedItem) {
        const errorResponse = ApiResponseBuilder.error(
          "ITEM_NOT_FOUND",
          "Item not found"
        );
        return reply.status(404).send(errorResponse);
      }

      return reply.send(ApiResponseBuilder.success(updatedItem));
    } catch (error) {
      const errorResponse = ApiResponseBuilder.error(
        "INTERNAL_SERVER_ERROR",
        "Internal server error",
        error instanceof Error ? error.message : undefined
      );
      return reply.status(500).send(errorResponse);
    }
  }

  async delete(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      const id = parseInt(request.params.id);
      await this.service.delete(id);
      return reply.status(204).send();
    } catch (error) {
      const errorResponse = ApiResponseBuilder.error(
        "INTERNAL_SERVER_ERROR",
        "Internal server error",
        error instanceof Error ? error.message : undefined
      );
      return reply.status(500).send(errorResponse);
    }
  }
}
