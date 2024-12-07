import { FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";
import { authConfig } from "../config/auth";
import { userService } from "../modules/users/user.service";
import { UnauthorizedError } from "../utils/errors";

export async function authMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new UnauthorizedError("No token provided");
  }

  const [, token] = authHeader.split(" ");

  try {
    const decoded = jwt.verify(token, authConfig.jwt.secret) as {
      id: number;
      email: string;
      companyId: number;
    };

    // Busca o usuário completo do banco
    const user = await userService.findById(decoded.id);
    if (!user) {
      throw new UnauthorizedError("User not found");
    }

    // Armazena tanto o usuário quanto o token na request
    request.user = user;
    request.token = token;
  } catch (error) {
    throw new UnauthorizedError("Invalid token");
  }
}
