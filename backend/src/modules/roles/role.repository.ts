import { AppDataSource } from '@config/database.config';
import { BaseRepository } from '@modules/base/base.repository';
import { Role } from '@modules/roles/role.model';

export class RoleRepository extends BaseRepository<Role> {
  constructor() {
    super(Role, AppDataSource);
  }
}

export const roleRepository = new RoleRepository();
