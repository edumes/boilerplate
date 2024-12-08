import { FastifyReply, FastifyRequest } from 'fastify';
import { ApiResponseBuilder } from '../../utils/api-response.util';
import { BaseController } from '../base/base.controller';
import { Audit } from './audit.entity';
import { auditService } from './audit.service';

export class AuditController extends BaseController<Audit> {
  constructor() {
    super(auditService);
  }

  async getEntityHistory(
    request: FastifyRequest<{
      Params: { entityName: string; entityId: string };
      Querystring: { page?: number; limit?: number };
    }>,
    reply: FastifyReply,
  ) {
    try {
      const { entityName, entityId } = request.params;
      const history = await auditService.getEntityHistory(entityName);

      return reply.send(ApiResponseBuilder.success(history));
    } catch (error) {
      return reply
        .status(500)
        .send(
          ApiResponseBuilder.error(
            'FETCH_HISTORY_FAILED',
            'Unable to fetch entity history',
            error instanceof Error ? error.stack : undefined,
          ),
        );
    }
  }
}

export const auditController = new AuditController();
