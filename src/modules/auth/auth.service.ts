import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { authConfig } from "../../config/auth";
import { ValidationError } from "../../utils/errors";
import { User } from "../users/user.entity";
import { userService } from "../users/user.service";

export class AuthService {
  async login(email: string, password: string) {
    const user = await userService.findByEmail(email);

    if (!user) {
      throw new ValidationError("Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new ValidationError("Invalid email or password");
    }

    const token = this.generateToken(user);

    return {
      user,
      token,
    };
  }

  private generateToken(user: User): string {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      authConfig.jwt.secret,
      {
        expiresIn: authConfig.jwt.expiresIn,
      }
    );
  }
}

export const authService = new AuthService();
