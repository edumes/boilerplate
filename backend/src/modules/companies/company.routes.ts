import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { registerGenericRoutes } from "../../config/routes";
import { authMiddleware } from "../../utils/auth.middleware";
import { companyController } from "./company.controller";

export default async function companyRoutes(
  server: FastifyInstance,
  options: FastifyPluginOptions
) {
  server.addHook("onRequest", authMiddleware);
  registerGenericRoutes(server, companyController);
} 