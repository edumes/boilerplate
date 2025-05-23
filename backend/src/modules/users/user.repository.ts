import { AppDataSource } from '@config/database.config';
import { BaseRepository } from '@modules/base/base.repository';
import { User } from '@modules/users/user.model';

export class UserRepository extends BaseRepository<User> {
  constructor() {
    super(User, AppDataSource);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.findOne({
      where: { user_email: email },
      relations: ['company', 'role']
    });
  }
}

export const userRepository = new UserRepository();
