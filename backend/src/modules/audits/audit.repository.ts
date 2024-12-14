import { AppDataSource } from '@config/database.config';
import { Audit } from '@modules/audits/audit.model';
import { BaseRepository } from '@modules/base/base.repository';

export class AuditRepository extends BaseRepository<Audit> {
  constructor() {
    super(Audit, AppDataSource);
  }
}

export const auditRepository = new AuditRepository();
