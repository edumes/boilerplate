import { ForbiddenError, ValidationError } from '@core/utils/errors.util';
import { generateToken, verifyToken } from '@core/utils/jwt.util';
import { companyService } from '@modules/companies/company.service';
import { User } from '@modules/users/user.model';
import { userService } from '@modules/users/user.service';
import bcrypt from 'bcrypt';
import { FastifyRequest } from 'fastify';

export class AuthService {
  async login(email: string, password: string) {
    // console.log({ email, password });
    const user = await userService.findByEmail(email);

    if (!user) {
      throw new ValidationError('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.user_password);

    if (!isPasswordValid) {
      throw new ValidationError('Invalid email or password');
    }

    // console.log({ user });
    if (!user.user_is_active) {
      throw new ForbiddenError('User is not active');
    }

    const company = await companyService.findById(user.user_fk_company_id);

    return {
      user: {
        ...user,
        company,
      },
      token: this.generateToken(user),
    };
  }

  private generateToken(user: User): string {
    return generateToken({
      id: user.id,
      email: user.user_email,
      companyId: user.user_fk_company_id,
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
        email: string;
        companyId: number;
      };

      const user = await userService.findById(decoded.id);
      if (!user) {
        return null;
      }

      const company = await companyService.findById(user.user_fk_company_id);
      return {
        ...user,
        company,
      } as User;
    } catch (error) {
      return null;
    }
  }
}

export const authService = new AuthService();
