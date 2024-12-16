import { BaseService } from '@modules/base/base.service';
import { Role } from './role.model';
import { roleRepository } from './role.repository';

export class RoleService extends BaseService<Role> {
  constructor() {
    super(roleRepository, 'Role');
  }

  async assignRoleToUser(userId: number, roleId: number): Promise<void> {
    await this.repository
      .createQueryBuilder()
      .update('users')
      .set({ user_fk_role_id: roleId })
      .where('id = :userId', { userId })
      .execute();
  }

  async removeRoleFromUser(userId: number, roleId: number): Promise<void> {
    await this.repository
      .createQueryBuilder()
      .update('users')
      .set({ user_fk_role_id: null })
      .where('id = :userId AND user_fk_role_id = :roleId', { userId, roleId })
      .execute();
  }

  async getUserRoles(userId: number): Promise<Role[]> {
    return this.repository
      .createQueryBuilder('role')
      .innerJoin('users', 'user', 'user.user_fk_role_id = role.id')
      .where('user.id = :userId', { userId })
      .getMany();
  }
}

export const roleService = new RoleService();
