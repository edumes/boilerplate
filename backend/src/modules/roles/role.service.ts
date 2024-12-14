import { AppDataSource } from '@config/database.config';
import { ValidationError } from '@core/utils/errors.util';
import { BaseService } from '@modules/base/base.service';
import { Role } from './role.model';
import { roleRepository } from './role.repository';

class RoleService extends BaseService<Role> {
  constructor() {
    super(roleRepository, 'Role');
  }

  async assignRoleToUser(userId: number, roleId: number): Promise<void> {
    const userRepository = AppDataSource.getRepository('User');
    const roleRepository = AppDataSource.getRepository('Role');

    const user = await userRepository.findOne({ where: { id: userId }, relations: ['roles'] });
    const role = await roleRepository.findOne({ where: { id: roleId } });

    if (!user || !role) {
      throw new ValidationError('User or Role not found');
    }

    user.roles = [...user.roles, role];
    await userRepository.save(user);
  }

  async removeRoleFromUser(userId: number, roleId: number): Promise<void> {
    const userRepository = AppDataSource.getRepository('User');

    const user = await userRepository.findOne({ where: { id: userId }, relations: ['roles'] });
    if (!user) {
      throw new ValidationError('User not found');
    }

    user.roles = user.roles.filter(role => role.id !== roleId);
    await userRepository.save(user);
  }

  async getUserRoles(userId: number): Promise<Role[]> {
    const userRepository = AppDataSource.getRepository('User');
    const user = await userRepository.findOne({ where: { id: userId }, relations: ['roles'] });

    if (!user) {
      throw new ValidationError('User not found');
    }

    return user.roles;
  }
}

export const roleService = new RoleService();
