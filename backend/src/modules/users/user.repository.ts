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
      select: {
        id: true,
        user_email: true,
        user_password: true,
        user_name: true,
        user_fk_company_id: true,
        created_at: true,
        updated_at: true,
      },
      relations: ['company'],
    });
  }
}

export const userRepository = new UserRepository();
