import { logger } from '@core/utils/logger';

/**
 * Base error class for application errors
 * @extends Error
 */
export class AppError extends Error {
  /**
   * Creates a new application error
   * @param code - Error code for identifying the type of error
   * @param message - Human-readable error message
   * @param status - HTTP status code (defaults to 500)
   * @param details - Additional error details
   */
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

/**
 * Error class for validation failures
 * @extends AppError
 */
export class ValidationError extends AppError {
  /**
   * Creates a new validation error
   * @param message - Validation error message
   * @param details - Additional validation error details
   */
  constructor(message: string, details?: any) {
    super('VALIDATION_ERROR', message, 400, details);
    logger.warn(message);
  }
}

/**
 * Error class for resource not found errors
 * @extends AppError
 */
export class NotFoundError extends AppError {
  /**
   * Creates a new not found error
   * @param resource - Name of the resource that was not found
   * @param id - Optional ID of the resource that was not found
   */
  constructor(resource: string, id?: string | number) {
    super('NOT_FOUND', `${resource}${id ? ` with ID ${id}` : ''} not found`, 404);
  }
}

/**
 * Error class for unauthorized access errors
 * @extends AppError
 */
export class UnauthorizedError extends AppError {
  /**
   * Creates a new unauthorized error
   * @param message - Unauthorized access message (defaults to 'Unauthorized access')
   */
  constructor(message: string = 'Unauthorized access') {
    super('UNAUTHORIZED', message, 401);
    logger.error(message);
  }
}

/**
 * Error class for forbidden access errors
 * @extends AppError
 */
export class ForbiddenError extends AppError {
  /**
   * Creates a new forbidden error
   * @param message - Forbidden access message (defaults to 'Access forbidden')
   */
  constructor(message: string = 'Access forbidden') {
    super('FORBIDDEN', message, 403);
    logger.error(message);
  }
}

/**
 * Error class for bad request errors with validation details
 * @extends Error
 */
export class BadRequestError extends Error {
  /** HTTP status code for bad request */
  public statusCode: number;
  /** Validation errors by field */
  public validationErrors?: Record<string, string[]>;

  /**
   * Creates a new bad request error
   * @param message - Bad request error message
   * @param validationErrors - Optional validation errors by field
   */
  constructor(message: string, validationErrors?: Record<string, string[]>) {
    super(message);
    this.name = 'BadRequestError';
    this.statusCode = 400;
    this.validationErrors = validationErrors;
  }
}
