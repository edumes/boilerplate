import { AppDataSource } from "../../config/database";
import { BaseRepository } from "../base/base.repository";
import { User } from "./user.entity";

export class UserRepository extends BaseRepository<User> {
  constructor() {
    super(User, AppDataSource);
  }

  async findByEmail(
    email: string,
    includePassword: boolean = false
  ): Promise<User | null> {
    return this.findOne({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}

export const userRepository = new UserRepository();
