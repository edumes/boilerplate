import { BadRequestError } from '@core/utils/errors.util';
import { plainToClass } from 'class-transformer';
import { ValidationError, validate } from 'class-validator';
import { FastifyReply, FastifyRequest } from 'fastify';

export function validationMiddleware(type: any) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const input = plainToClass(type, request.body as any);
    const errors: ValidationError[] = await validate(input);

    if (errors.length > 0) {
      const validationErrors = errors.reduce((acc: Record<string, string[]>, error) => {
        acc[error.property] = Object.values(error.constraints || {});
        return acc;
      }, {});

      throw new BadRequestError('Validation failed', validationErrors);
    }

    request.body = input;
  };
}
