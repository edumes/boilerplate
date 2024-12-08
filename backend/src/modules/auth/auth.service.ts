import { authConfig } from '@config/auth';
import { companyService } from '@modules/companies/company.service';
import { User } from '@modules/users/user.entity';
import { userService } from '@modules/users/user.service';
import { ValidationError } from '@utils/errors';
import bcrypt from 'bcrypt';
import { FastifyRequest } from 'fastify';
import jwt from 'jsonwebtoken';

export class AuthService {
  async login(email: string, password: string) {
    // console.log({ email, password });
    const user = await userService.findByEmail(email);
    // console.log({ user });

    if (!user) {
      throw new ValidationError('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.user_password);

    if (!isPasswordValid) {
      throw new ValidationError('Invalid email or password');
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
    return jwt.sign(
      {
        id: user.id,
        email: user.user_email,
        companyId: user.user_fk_company_id,
      },
      authConfig.jwt.secret,
      {
        expiresIn: authConfig.jwt.expiresIn,
      },
    );
  }

  async getCurrentUser(request: FastifyRequest): Promise<User | null> {
    const token = request.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return null;
    }

    try {
      const decoded = jwt.verify(token, authConfig.jwt.secret) as {
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
