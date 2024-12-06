import { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { EntityNotFoundError } from "typeorm";
import { ApiResponseBuilder } from "./api-response.util";
import { AppError } from "./errors";
import { logger } from "./logger";

export async function errorHandler(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
) {
  logger.error("Error caught by error handler:", {
    error: error.message,
    stack: error.stack,
    path: request.url,
    method: request.method,
  });

  if (error instanceof AppError) {
    return reply
      .status(error.status)
      .send(ApiResponseBuilder.error(error.code, error.message, error.details));
  }

  if (error instanceof EntityNotFoundError) {
    return reply
      .status(404)
      .send(ApiResponseBuilder.error("NOT_FOUND", "Resource not found"));
  }

  if (error.validation) {
    return reply
      .status(400)
      .send(
        ApiResponseBuilder.error(
          "VALIDATION_ERROR",
          "Validation failed",
          error.validation
        )
      );
  }

  return reply
    .status(500)
    .send(
      ApiResponseBuilder.error(
        "INTERNAL_SERVER_ERROR",
        "An unexpected error occurred",
        process.env.NODE_ENV === "development" ? error.stack : undefined
      )
    );
}
