import { FastifyReply, FastifyRequest } from "fastify";
import { DeepPartial } from "typeorm";
import { ApiResponseBuilder, PaginationOptions } from "../../utils/api-response.util";
import { IBaseEntity } from "./base.entity";
import { BaseService } from "./base.service";

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
      return reply.send(ApiResponseBuilder.success(items, meta));
    } catch (error) {
      return reply
        .status(500)
        .send(
          ApiResponseBuilder.error(
            "INTERNAL_SERVER_ERROR",
            "Unable to fetch items. Please try again later.",
            error instanceof Error ? error.stack : undefined
          )
        );
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
        return reply
          .status(404)
          .send(
            ApiResponseBuilder.error(
              "ITEM_NOT_FOUND",
              `Item with ID ${id} not found.`
            )
          );
      }

      return reply.send(ApiResponseBuilder.success(item));
    } catch (error) {
      return reply
        .status(500)
        .send(
          ApiResponseBuilder.error(
            "INTERNAL_SERVER_ERROR",
            "Error fetching the item. Please try again later.",
            error instanceof Error ? error.stack : undefined
          )
        );
    }
  }

  async create(
    request: FastifyRequest<{ Body: Partial<T> & Record<string, unknown> }>,
    reply: FastifyReply
  ) {
    try {
      const newItem = await this.service.create(request.body as DeepPartial<T>);
      return reply
        .status(201)
        .send(ApiResponseBuilder.success(newItem, undefined));
    } catch (error) {
      return reply
        .status(500)
        .send(
          ApiResponseBuilder.error(
            "CREATE_FAILED",
            "Unable to create the item. Please try again later.",
            error instanceof Error ? error.stack : undefined
          )
        );
    }
  }

  async update(
    request: FastifyRequest<{
      Params: { id: string };
      Body: Partial<T> & Record<string, unknown>;
    }>,
    reply: FastifyReply
  ) {
    try {
      const id = parseInt(request.params.id);
      const updatedItem = await this.service.update(id, request.body as any);

      if (!updatedItem) {
        return reply
          .status(404)
          .send(
            ApiResponseBuilder.error(
              "ITEM_NOT_FOUND",
              `Item with ID ${id} not found.`
            )
          );
      }

      return reply.send(ApiResponseBuilder.success(updatedItem));
    } catch (error) {
      return reply
        .status(500)
        .send(
          ApiResponseBuilder.error(
            "UPDATE_FAILED",
            "Unable to update the item. Please try again later.",
            error instanceof Error ? error.stack : undefined
          )
        );
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
      return reply
        .status(500)
        .send(
          ApiResponseBuilder.error(
            "DELETE_FAILED",
            `Unable to delete item with ID ${request.params.id}.`,
            error instanceof Error ? error.stack : undefined
          )
        );
    }
  }
}
