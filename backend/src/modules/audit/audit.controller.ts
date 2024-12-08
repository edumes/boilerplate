import { Audit } from '@modules/audit/audit.entity';
import { auditService } from '@modules/audit/audit.service';
import { BaseController } from '@modules/base/base.controller';
import { ApiResponseBuilder } from '@utils/api-response.util';
import { FastifyReply, FastifyRequest } from 'fastify';

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
