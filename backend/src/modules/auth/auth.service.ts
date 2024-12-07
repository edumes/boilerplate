import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { authConfig } from "../../config/auth";
import { ValidationError } from "../../utils/errors";
import { User } from "../users/user.entity";
import { userService } from "../users/user.service";
import { companyService } from "../companies/company.service";

export class AuthService {
  async login(email: string, password: string) {
    // console.log({ email, password });
    const user = await userService.findByEmail(email);
    console.log({ user });

    if (!user) {
      throw new ValidationError("Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(password, user.user_password);

    if (!isPasswordValid) {
      throw new ValidationError("Invalid email or password");
    }

    // Carrega os dados da empresa
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
      }
    );
  }
}

export const authService = new AuthService();
