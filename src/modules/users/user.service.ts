import { BaseService } from "../base/base.service";
import { User } from "./user.entity";
import { userRepository } from "./user.repository";

export class UserService extends BaseService<User> {
  constructor() {
    super(userRepository);
  }

  // Métodos específicos do UserService
  async findByEmail(email: string): Promise<User | null> {
    return userRepository.findByEmail(email);
  }
}

export const userService = new UserService();