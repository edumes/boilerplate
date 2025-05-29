import { validationMiddleware } from '@core/middlewares/validation.middleware';
import { logger } from '@core/utils/logger';
import { User } from '@modules/users/user.model';
import { FastifyInstance } from 'fastify';
import { readdir } from 'fs/promises';
import path from 'path';
import { EntityTarget } from 'typeorm';

/**
 * Extends FastifyRequest to include user and token properties
 */
declare module 'fastify' {
  interface FastifyRequest {
    /** The authenticated user */
    user?: User;
    /** The authentication token */
    token?: string;
  }
}

/** HTTP methods supported by the application */
export type HttpMethod = 'get' | 'post' | 'put' | 'delete';

/**
 * Defines the structure of a route
 */
export type RouteDefinition = {
  /** HTTP method for the route */
  method: HttpMethod;
  /** URL path for the route */
  url: string;
  /** Request handler function */
  handler: (request: any, reply: any) => any;
  /** Optional pre-handler middleware function */
  preHandler?: (request: any, reply: any) => Promise<void>;
};

/**
 * Interface defining the standard controller methods
 */
export interface GenericController {
  /** Retrieves all items */
  findAll: (request: any, reply: any) => Promise<void> | void;
  /** Retrieves an item by ID */
  findById: (request: any, reply: any) => Promise<void> | void;
  /** Retrieves items based on conditions */
  findByConditions: (request: any, reply: any) => Promise<void> | void;
  /** Creates a new item */
  create: (request: any, reply: any) => Promise<void> | void;
  /** Updates an existing item */
  update: (request: any, reply: any) => Promise<void> | void;
  /** Deletes an item */
  delete: (request: any, reply: any) => Promise<void> | void;
  /** Searches for items */
  search: (request: any, reply: any) => Promise<void> | void;
  /** Counts items */
  count: (request: any, reply: any) => Promise<void> | void;
  /** Clones an existing item */
  clone: (request: any, reply: any) => Promise<void> | void;
  /** Gets select options for the entity */
  getSelectOptions: (request: any, reply: any) => Promise<void> | void;
  /** Gets available fields for the entity */
  getFields: (request: any, reply: any) => Promise<void> | void;
  /** Generates a report */
  generateReport: (request: any, reply: any) => Promise<void | string> | void;
}

/**
 * Generator function that recursively finds all route files in a directory
 * @param dir - The directory to search in
 * @yields The full path of each route file found
 */
async function* getRouteFiles(dir: string): AsyncGenerator<string> {
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      yield* getRouteFiles(fullPath);
    } else if (
      entry.isFile() &&
      (entry.name.endsWith('.routes.ts') || entry.name.endsWith('.routes.js'))
    ) {
      yield fullPath;
    }
  }
}

/**
 * Registers all route modules found in the modules directory
 * @param server - The Fastify server instance
 */
export async function registerRoutes(server: FastifyInstance) {
  const modulesPath = path.join(__dirname, '../modules');

  for await (const routeFile of getRouteFiles(modulesPath)) {
    const routeModule = await import(routeFile);

    const routePrefix = path
      .relative(modulesPath, routeFile)
      .replace(/\\/g, '/')
      .split('/')[0]
      .toLowerCase();

    const sanitizedPrefix = encodeURIComponent(routePrefix);

    logger.info(`registered route ${sanitizedPrefix}`);
    server.register(routeModule.default, {
      prefix: `/api/v1/${sanitizedPrefix}`
    });
  }
}

/**
 * Registers generic CRUD routes for a controller
 * @param server - The Fastify server instance
 * @param controller - The controller instance implementing GenericController
 * @param entityType - The TypeORM entity type for validation
 * @param additionalRoutes - Optional additional routes to register
 */
export function registerGenericRoutes(
  server: FastifyInstance,
  controller: GenericController,
  entityType: EntityTarget<any>,
  additionalRoutes?: RouteDefinition[]
) {
  const baseRoutes: RouteDefinition[] = [
    { method: 'get', url: '/', handler: controller.findAll },
    { method: 'get', url: '/filter', handler: controller.findByConditions },
    { method: 'get', url: '/:id', handler: controller.findById },
    {
      method: 'post',
      url: '/',
      handler: controller.create,
      preHandler: validationMiddleware(entityType)
    },
    {
      method: 'put',
      url: '/:id',
      handler: controller.update,
      preHandler: validationMiddleware(entityType)
    },
    { method: 'delete', url: '/:id', handler: controller.delete },
    { method: 'get', url: '/search', handler: controller.search },
    { method: 'get', url: '/count', handler: controller.count },
    { method: 'post', url: '/:id/clone', handler: controller.clone },
    { method: 'get', url: '/select-options', handler: controller.getSelectOptions },
    { method: 'get', url: '/fields', handler: controller.getFields },
    { method: 'get', url: '/report', handler: controller.generateReport }
  ];

  const routes = additionalRoutes ? [...baseRoutes, ...additionalRoutes] : baseRoutes;

  routes.forEach(({ method, url, handler, preHandler }) => {
    if (preHandler) {
      server[method](url, { preHandler }, handler.bind(controller));
    } else {
      server[method](url, handler.bind(controller));
    }
  });
}
