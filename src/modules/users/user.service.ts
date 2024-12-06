import { BaseService } from "../base/base.service";
import { User } from "./user.entity";
import { userRepository } from "./user.repository";
// import { validateEmail, validatePassword } from "../../utils/validation";

export class UserService extends BaseService<User> {
  constructor() {
    super(userRepository, "User");

    this.setHooks({
      beforeCreate: async (data) => {
        console.log({ data });
        // if (!validateEmail(data.email)) {
        //   throw new Error("Invalid email format");
        // }
        // if (!validatePassword(data.password)) {
        //   throw new Error("Password must be at least 8 characters long");
        // }
      },
      afterCreate: async (entity) => {
        // Send welcome email
        await this.sendWelcomeEmail(entity);
      },
      beforeUpdate: async (id, data) => {
        // if (data.email && !validateEmail(data.email)) {
        //   throw new Error("Invalid email format");
        // }
        // if (data.password && !validatePassword(data.password)) {
        //   throw new Error("Password must be at least 8 characters long");
        // }
      },
      afterUpdate: async (entity) => {
        // Clear user cache
        await this.clearUserCache(entity.id);
      },
      beforeDelete: async (id) => {
        // Check if user can be deleted
        await this.checkUserDeletionAllowed(id);
      },
      afterDelete: async (entity) => {
        // Clean up user related data
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
