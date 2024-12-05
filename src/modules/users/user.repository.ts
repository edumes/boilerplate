import { AppDataSource } from "../../config/database";
import { BaseRepository } from "../base/base.repository";
import { User } from "./user.entity";

export class UserRepository extends BaseRepository<User> {
  constructor() {
    super(User, AppDataSource);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.findOne({ where: { email } });
  }
}

export const userRepository = new UserRepository();
