import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { registerGenericRoutes } from "../../config/routes";
import { auditController } from "./audit.controller";

export default async function auditRoutes(
  server: FastifyInstance,
  options: FastifyPluginOptions
) {
  registerGenericRoutes(server, auditController);

  server.get(
    "/entity/:entityName/:entityId",
    auditController.getEntityHistory.bind(auditController)
  );
}
