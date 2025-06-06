import { AppError } from '@core/utils/errors.util';
import { logger } from '@core/utils/logger';
import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';

/**
 * Global error handler for uncaught exceptions
 * Logs error details including name, message, stack trace and context
 * @param error - The error that was thrown
 * @param context - The context where the error occurred
 */
export function globalErrorHandler(error: Error, context: string) {
  logger.error('Uncaught exception', {
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack,
      context
    }
  });
}

/**
 * Fastify error handler for request errors
 * Handles different types of errors and returns appropriate responses
 * @param error - The Fastify error object
 * @param request - The Fastify request object
 * @param reply - The Fastify reply object
 * @returns Promise with the error response
 */
export async function fastifyErrorHandler(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
) {
  logger.error('Request error', {
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack
    },
    request: {
      method: request.method,
      url: request.url,
      params: request.params,
      query: request.query,
      body: request.body
    }
  });

  if (error instanceof AppError) {
    return reply.status(error.status).send({
      error: true,
      message: error.message,
      code: error.code,
      details: error.details
    });
  }

  if (error.name === 'BadRequestError' && 'validationErrors' in error) {
    return reply.status(400).send({
      success: false,
      timestamp: new Date().toISOString(),
      message: 'VALIDATION_ERROR',
      errors: (error as any).validationErrors
    });
  }

  const errorMessage =
    process.env.NODE_ENV === 'production' ? 'Internal Server Error' : error.message;

  return reply.status(error.statusCode || 500).send({
    error: true,
    message: errorMessage,
    code: error.code || 'INTERNAL_ERROR'
  });
}
