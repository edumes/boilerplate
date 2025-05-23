import { logger } from '@core/utils/logger';

export class AppError extends Error {
  constructor(
    public code: string,
    message: string,
    public status: number = 500,
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super('VALIDATION_ERROR', message, 400, details);
    logger.warn(message);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, id?: string | number) {
    super('NOT_FOUND', `${resource}${id ? ` with ID ${id}` : ''} not found`, 404);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized access') {
    super('UNAUTHORIZED', message, 401);
    logger.error(message);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Access forbidden') {
    super('FORBIDDEN', message, 403);
    logger.error(message);
  }
}

export class BadRequestError extends Error {
  public statusCode: number;
  public validationErrors?: Record<string, string[]>;

  constructor(message: string, validationErrors?: Record<string, string[]>) {
    super(message);
    this.name = 'BadRequestError';
    this.statusCode = 400;
    this.validationErrors = validationErrors;
  }
}
