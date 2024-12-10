import { AppDataSource } from '@config/database';
import { BaseService } from '@modules/base/base.service';
import { Permission } from '@modules/permissions/permission.entity';
import { User } from '@modules/users/user.entity';
import { UnauthorizedError } from '@utils/errors';

export class PermissionService extends BaseService<Permission> {
  constructor() {
    super(AppDataSource.getRepository(Permission), 'Permission');
  }

  async checkPermission(user: User, resource: string, action: string): Promise<boolean> {
    if (!user) return false;

    const userWithRoles = await AppDataSource.getRepository(User)
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'role')
      .leftJoinAndSelect('role.permissions', 'permission')
      .where('user.id = :userId', { userId: user.id })
      .getOne();

    if (!userWithRoles) return false;

    return userWithRoles.roles.some(role =>
      role.permissions.some(
        permission =>
          permission.permission_resource === resource && permission.permission_action === action,
      ),
    );
  }

  async requirePermission(user: User, resource: string, action: string): Promise<void> {
    const hasPermission = await this.checkPermission(user, resource, action);
    if (!hasPermission) {
      throw new UnauthorizedError(`User does not have permission to ${action} ${resource}`);
    }
  }
}

export const permissionService = new PermissionService();
