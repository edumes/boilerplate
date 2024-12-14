import { logger } from '@core/utils/logger';
import { User } from '@modules/users/user.model';
import { FastifyInstance } from 'fastify';
import { readdir } from 'fs/promises';
import path from 'path';

declare module 'fastify' {
  interface FastifyRequest {
    user?: User;
    token?: string;
  }
}

export type HttpMethod = 'get' | 'post' | 'put' | 'delete';

interface GenericController {
  findAll: (request: any, reply: any) => Promise<void> | void;
  findById: (request: any, reply: any) => Promise<void> | void;
  findByConditions: (request: any, reply: any) => Promise<void> | void;
  create: (request: any, reply: any) => Promise<void> | void;
  update: (request: any, reply: any) => Promise<void> | void;
  delete: (request: any, reply: any) => Promise<void> | void;
  search: (request: any, reply: any) => Promise<void> | void;
  count: (request: any, reply: any) => Promise<void> | void;
  clone: (request: any, reply: any) => Promise<void> | void;
  getSelectOptions: (request: any, reply: any) => Promise<void> | void;
  getFields: (request: any, reply: any) => Promise<void> | void;
}

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
      prefix: `/api/v1/${sanitizedPrefix}`,
    });
  }
}

export function registerGenericRoutes(server: FastifyInstance, controller: GenericController) {
  const routes: { method: HttpMethod; url: string; handler: Function }[] = [
    { method: 'get', url: '/', handler: controller.findAll },
    { method: 'get', url: '/filter', handler: controller.findByConditions },
    { method: 'get', url: '/:id', handler: controller.findById },
    { method: 'post', url: '/', handler: controller.create },
    { method: 'put', url: '/:id', handler: controller.update },
    { method: 'delete', url: '/:id', handler: controller.delete },
    { method: 'get', url: '/search', handler: controller.search },
    { method: 'get', url: '/count', handler: controller.count },
    { method: 'post', url: '/:id/clone', handler: controller.clone },
    { method: 'get', url: '/select-options', handler: controller.getSelectOptions },
    { method: 'get', url: '/fields', handler: controller.getFields },
  ];

  routes.forEach(({ method, url, handler }) => {
    server[method](url, handler.bind(controller));
  });
}
