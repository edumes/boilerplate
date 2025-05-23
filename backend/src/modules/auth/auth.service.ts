import { ForbiddenError, ValidationError } from '@core/utils/errors.util';
import { generateToken, verifyToken } from '@core/utils/jwt.util';
import { companyService } from '@modules/companies/company.service';
import { User } from '@modules/users/user.model';
import { userService } from '@modules/users/user.service';
import bcrypt from 'bcrypt';
import { FastifyRequest } from 'fastify';
import i18next from 'i18next';

export class AuthService {
  async login(email: string, password: string) {
    // console.log({ email, password });
    const user = await userService.findByEmail(email);

    if (!user) {
      throw new ValidationError(i18next.t('INVALID_EMAIL_OR_PASSWORD'));
    }

    const isPasswordValid = await bcrypt.compare(password, user.user_password);

    if (!isPasswordValid) {
      throw new ValidationError(i18next.t('INVALID_EMAIL_OR_PASSWORD'));
    }

    // console.log({ user });
    if (!user.user_is_active) {
      throw new ForbiddenError(i18next.t('USER_NOT_ACTIVE'));
    }

    const company = await companyService.findById(user.user_fk_company_id);

    return {
      user: {
        ...user,
        user_password: undefined,
        company
      },
      token: this.generateToken(user)
    };
  }

  private generateToken(user: User): string {
    return generateToken({
      id: user.id,
      user_email: user.user_email,
      user_fk_company_id: user.user_fk_company_id
    });
  }

  async getCurrentUser(request: FastifyRequest): Promise<User | null> {
    const token = request.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return null;
    }

    try {
      const decoded = (await verifyToken(token)) as {
        id: number;
        user_email: string;
        user_fk_company_id: number;
      };

      const user = await userService.findById(decoded.id);
      if (!user) {
        return null;
      }

      const company = await companyService.findById(user.user_fk_company_id);
      return {
        ...user,
        user_password: undefined,
        company
      } as User;
    } catch (error) {
      return null;
    }
  }
}

export const authService = new AuthService();
