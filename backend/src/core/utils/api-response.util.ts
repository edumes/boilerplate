import { logger } from '@core/utils/logger';

/**
 * Interface for pagination metadata
 */
export interface PaginationMeta {
  /** Current page number */
  page: number;
  /** Number of items per page */
  limit: number;
  /** Total number of items */
  totalItems: number;
  /** Total number of pages */
  totalPages: number;
  /** Whether there is a next page */
  hasNextPage: boolean;
  /** Whether there is a previous page */
  hasPreviousPage: boolean;
}

/**
 * Generic interface for API responses
 * @template T - Type of the response data
 */
export interface ApiResponse<T> {
  /** Whether the request was successful */
  success: boolean;
  /** Timestamp of the response */
  timestamp: string;
  /** Response data */
  data?: T;
  /** Error information if the request failed */
  error?: {
    /** Error code */
    code: string;
    /** Error message */
    message: string;
    /** Additional error details */
    details?: any;
  };
  /** Pagination metadata if applicable */
  meta?: PaginationMeta;
}

/**
 * Interface for pagination options
 */
export interface PaginationOptions {
  /** Page number */
  page?: number;
  /** Number of items per page */
  limit?: number;
  /** Sorting options */
  order?: Record<string, 'ASC' | 'DESC'>;
}

/**
 * Builder class for constructing standardized API responses
 */
export class ApiResponseBuilder {
  /**
   * Creates a success response
   * @template T - Type of the response data
   * @param data - The response data
   * @param meta - Optional pagination metadata
   * @returns Standardized success response
   */
  static success<T>(data: T, meta?: PaginationMeta): ApiResponse<T> {
    const response = {
      success: true,
      timestamp: new Date().toISOString(),
      data,
      meta
    };

    logger.info('API Success Response', { response });
    return response;
  }

  /**
   * Creates an error response
   * @param code - Error code
   * @param message - Error message
   * @param details - Optional error details
   * @returns Standardized error response
   */
  static error(code: string, message: string, details?: any): ApiResponse<null> {
    const response = {
      success: false,
      timestamp: new Date().toISOString(),
      error: {
        code,
        message,
        details
      }
    };

    logger.error('API Error Response', { response });
    return response;
  }

  /**
   * Builds pagination metadata based on total items and options
   * @param totalItems - Total number of items
   * @param options - Pagination options
   * @returns Pagination metadata
   */
  static buildPaginationMeta(totalItems: number, options: PaginationOptions): PaginationMeta {
    const page = Number(options.page) || 1;
    const limit = Number(options.limit) || 10;
    const totalPages = Math.ceil(totalItems / limit);

    return {
      page,
      limit,
      totalItems,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1
    };
  }
}
