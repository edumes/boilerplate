import { ApiResponseBuilder } from '@core/utils/api-response.util';
import { AuditService, auditService } from '@modules/audits/audit.service';
import { FastifyReply, FastifyRequest } from 'fastify';

export class AuditController {
  private service: AuditService;
  constructor() {
    this.service = auditService;
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
      const history = await this.service.getEntityHistory(entityName);

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
