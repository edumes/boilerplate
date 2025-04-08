import { authConfig } from '@config/auth.config';
import { ForbiddenError } from '@core/utils/errors.util';
import { BaseService } from '@modules/base/base.service';
import { User } from '@modules/users/user.model';
import { userRepository } from '@modules/users/user.repository';
import bcrypt from 'bcrypt';
import i18next from 'i18next';

export class UserService extends BaseService<User> {
  constructor() {
    super(userRepository, 'User');

    this.setHooks({
      beforeCreate: async data => {
        const currentUser = this.getCurrentUser();

        if (currentUser && data.user_fk_company_id != currentUser.user_fk_company_id) {
          throw new ForbiddenError(i18next.t('CAN_ONLY_CREATE_USERS_FOR_OWN_COMPANY'));
        }

        if (data.user_password) {
          data.user_password = await bcrypt.hash(
            String(data.user_password),
            authConfig.passwordSaltRounds,
          );
        }
      },
      beforeUpdate: async (id, data) => {
        if (data.user_password) {
          data.user_password = await bcrypt.hash(
            String(data.user_password),
            authConfig.passwordSaltRounds,
          );
        }
      }
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return userRepository.findByEmail(email);
  }
}

export const userService = new UserService();
