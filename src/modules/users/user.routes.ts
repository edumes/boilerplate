import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { registerGenericRoutes } from "../../config/routes";
import { userController } from "./user.controller";

export default async function userRoutes(
  server: FastifyInstance,
  options: FastifyPluginOptions
) {
  registerGenericRoutes(server, userController);
}
