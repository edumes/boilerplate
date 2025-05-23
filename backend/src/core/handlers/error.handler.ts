import { logger } from '@core/utils/logger';
import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';

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
