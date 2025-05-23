import { FastifySchema } from 'fastify';

export function RouteSchema(schema: FastifySchema) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      const request = args[0];
      if (request && request.server) {
        request.server.route({
          method: request.method,
          url: request.url,
          schema: schema,
          handler: originalMethod.bind(this, ...args)
        });
      }
      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}

const genericRoutes = {
  login: {
    description: 'User login endpoint',
    tags: ['Auth'],
    body: {
      type: 'object',
      required: ['user_email', 'user_password'],
      properties: {
        user_email: { type: 'string', format: 'email' },
        user_password: { type: 'string', minLength: 8 }
      }
    },
    response: {
      200: {
        description: 'Successful response',
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          data: {
            type: 'object',
            properties: {
              user: {
                type: 'object',
                properties: {
                  id: { type: 'number' },
                  user_email: { type: 'string' },
                  user_password: { type: 'string' }
                }
              },
              token: { type: 'string' }
            }
          }
        }
      }
    }
  },
  findAll: {
    description: 'Get all items with pagination',
    tags: ['Generic'],
    querystring: {
      type: 'object',
      properties: {
        page: { type: 'number', minimum: 1 },
        limit: { type: 'number', minimum: 1 },
        order: { type: 'object', additionalProperties: true }
      }
    },
    response: {
      200: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          data: { type: 'array', items: { type: 'object' } },
          meta: {
            type: 'object',
            properties: {
              total: { type: 'number' },
              page: { type: 'number' },
              lastPage: { type: 'number' }
            }
          }
        }
      }
    }
  }
};

export default genericRoutes;
