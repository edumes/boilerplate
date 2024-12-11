import { AppDataSource } from '@config/database.config';
import { Audit, AuditAction } from '@modules/audit/audit.model';
import { BaseService } from '@modules/base/base.service';

export class AuditService extends BaseService<Audit> {
  constructor() {
    super(AppDataSource.getRepository(Audit), 'Audit');
  }

  async logChange(params: {
    audit_entity_name: string;
    audit_action: AuditAction;
    audit_old_values?: Record<string, any>;
    audit_new_values?: Record<string, any>;
    audit_fk_user_id?: number;
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
