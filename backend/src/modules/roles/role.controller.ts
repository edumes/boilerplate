import { ApiResponseBuilder } from '@core/utils/api-response.util';
import { BaseController } from '@modules/base/base.controller';
import { FastifyReply, FastifyRequest } from 'fastify';
import { Role } from './role.model';
import { roleService } from './role.service';

export class RoleController extends BaseController<Role> {
  constructor() {
    super(roleService);
  }

  async assignRole(
    request: FastifyRequest<{
      Params: { userId: string; roleId: string };
    }>,
    reply: FastifyReply
  ) {
    try {
      const { userId, roleId } = request.params;
      await roleService.assignRoleToUser(Number(userId), Number(roleId));
      return reply.send(ApiResponseBuilder.success({ message: 'Role assigned successfully' }));
    } catch (error) {
      return reply
        .status(500)
        .send(
          ApiResponseBuilder.error(
            'ASSIGN_ROLE_FAILED',
            'Unable to assign role',
            error instanceof Error ? error.stack : undefined
          )
        );
    }
  }

  async removeRole(
    request: FastifyRequest<{
      Params: { userId: string; roleId: string };
    }>,
    reply: FastifyReply
  ) {
    try {
      const { userId, roleId } = request.params;
      await roleService.removeRoleFromUser(Number(userId), Number(roleId));
      return reply.send(ApiResponseBuilder.success({ message: 'Role removed successfully' }));
    } catch (error) {
      return reply
        .status(500)
        .send(
          ApiResponseBuilder.error(
            'REMOVE_ROLE_FAILED',
            'Unable to remove role',
            error instanceof Error ? error.stack : undefined
          )
        );
    }
  }

  async getUserRoles(
    request: FastifyRequest<{
      Params: { userId: string };
    }>,
    reply: FastifyReply
  ) {
    try {
      const { userId } = request.params;
      const roles = await roleService.getUserRoles(Number(userId));
      return reply.send(ApiResponseBuilder.success(roles));
    } catch (error) {
      return reply
        .status(500)
        .send(
          ApiResponseBuilder.error(
            'GET_USER_ROLES_FAILED',
            'Unable to get user roles',
            error instanceof Error ? error.stack : undefined
          )
        );
    }
  }
}

export const roleController = new RoleController();
