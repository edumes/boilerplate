import { AuditAction } from '@core/enums/audit-action.enum';
import { Audit } from '@modules/audits/audit.model';
import { auditRepository } from '@modules/audits/audit.repository';
import { Repository } from 'typeorm';

export class AuditService {
  private repository: Repository<Audit>;
  constructor() {
    this.repository = auditRepository;
  }

  async logChange(params: {
    audit_entity_name: string;
    audit_action: AuditAction;
    audit_old_values?: Record<string, any>;
    audit_new_values?: Record<string, any>;
    created_by_fk_user_id?: number;
    audit_observation?: string;
  }): Promise<Audit> {
    const audit = this.repository.create({
      ...params,
      created_at: new Date(),
    });

    return this.repository.save(audit);
  }

  async getEntityHistory(entityName: string): Promise<Audit[]> {
    return this.repository.find({
      where: { audit_entity_name: entityName },
      order: { created_at: 'DESC' },
    });
  }
}
export const auditService = new AuditService();
