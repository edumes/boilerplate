import bcrypt from "bcrypt";
import { authConfig } from "../../config/auth";
import { BaseService } from "../base/base.service";
import { User } from "./user.entity";
import { userRepository } from "./user.repository";

export class UserService extends BaseService<User> {
  constructor() {
    super(userRepository, "User");

    this.setHooks({
      beforeCreate: async (data) => {
        if (data.user_password) {
          data.user_password = await bcrypt.hash(
            String(data.user_password),
            authConfig.passwordSaltRounds
          );
        }
      },
      beforeUpdate: async (id, data) => {
        if (data.user_password) {
          data.user_password = await bcrypt.hash(
            String(data.user_password),
            authConfig.passwordSaltRounds
          );
        }
      },
      afterCreate: async (entity) => {
        await this.sendWelcomeEmail(entity);
      },
      afterUpdate: async (entity) => {
        await this.clearUserCache(entity.id);
      },
      beforeDelete: async (id) => {
        await this.checkUserDeletionAllowed(id);
      },
      afterDelete: async (entity) => {
        await this.cleanupUserData(entity.id);
      },
    });
  }

  // Implementation of helper methods...
  private async sendWelcomeEmail(user: User) {}

  private async clearUserCache(userId: number) {}

  private async checkUserDeletionAllowed(userId: number) {}

  private async cleanupUserData(userId: number) {}

  // Métodos específicos
  async findByEmail(email: string): Promise<User | null> {
    return userRepository.findByEmail(email);
  }
}

export const userService = new UserService();
