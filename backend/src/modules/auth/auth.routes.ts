import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { authController } from "./auth.controller";

export default async function authRoutes(
  server: FastifyInstance,
  options: FastifyPluginOptions
) {
  server.post("/login", authController.login.bind(authController));
  server.get("/me", authController.getCurrentUser.bind(authController));
}
