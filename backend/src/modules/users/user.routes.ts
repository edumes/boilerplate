import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { registerGenericRoutes } from "../../config/routes";
import { authMiddleware } from "../../utils/auth.middleware";
import { userController } from "./user.controller";

export default async function userRoutes(
  server: FastifyInstance,
  options: FastifyPluginOptions
) {
  // server.addHook("onRequest", authMiddleware);
  registerGenericRoutes(server, userController);
}
