import { AppDataSource } from "../../config/database";
import { BaseService } from "../base/base.service";
import { Audit, AuditAction } from "./audit.entity";

export class AuditService extends BaseService<Audit> {
  constructor() {
    super(AppDataSource.getRepository(Audit), "Audit");
  }

  async logChange(params: {
    entity_name: string;
    action: AuditAction;
    old_values?: Record<string, any>;
    new_values?: Record<string, any>;
    user_id?: number;
  }): Promise<Audit> {
    const audit = this.repository.create({
      ...params,
      created_at: new Date(),
    });

    return this.repository.save(audit);
  }

  async getEntityHistory(
    entityName: string
  ): Promise<Audit[]> {
    return this.repository.find({
      where: { audit_entity_name: entityName },
      order: { created_at: "DESC" },
    });
  }
}

export const auditService = new AuditService();
