import { AppDataSource } from "../../config/database";
import { BaseRepository } from "../base/base.repository";
import { User } from "./user.entity";

export class UserRepository extends BaseRepository<User> {
  constructor() {
    super(User, AppDataSource);
  }

  async findByEmail(
    email: string
  ): Promise<User | null> {
    return this.findOne({
      where: { user_email: email },
      select: {
        id: true,
        user_email: true,
        user_password: false,
        user_name: true,
        created_at: true,
        updated_at: true,
      },
    });
  }
}

export const userRepository = new UserRepository();
