export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  timestamp: string;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: PaginationMeta;
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
  order?: Record<string, "ASC" | "DESC">;
}

export class ApiResponseBuilder {
  static success<T>(data: T, meta?: PaginationMeta): ApiResponse<T> {
    return {
      success: true,
      timestamp: new Date().toISOString(),
      data,
      meta,
    };
  }

  static error(
    code: string,
    message: string,
    details?: any
  ): ApiResponse<null> {
    return {
      success: false,
      timestamp: new Date().toISOString(),
      error: {
        code,
        message,
        details,
      },
    };
  }

  static buildPaginationMeta(
    totalItems: number,
    options: PaginationOptions
  ): PaginationMeta {
    const page = options.page || 1;
    const limit = options.limit || 10;
    const totalPages = Math.ceil(totalItems / limit);

    return {
      page,
      limit,
      totalItems,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };
  }
}
