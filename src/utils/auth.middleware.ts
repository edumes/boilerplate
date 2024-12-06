import { FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";
import { authConfig } from "../config/auth";
import { UnauthorizedError } from "../utils/errors";

declare module "fastify" {
  interface FastifyRequest {
    user?: any;
  }
}

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
    const decoded = jwt.verify(token, authConfig.jwt.secret);
    request.user = decoded;
  } catch (error) {
    throw new UnauthorizedError("Invalid token");
  }
}
