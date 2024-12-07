import Fastify from "fastify";
import { AppDataSource } from "./config/database";
import { env } from "./config/env";
import { registerRoutes } from "./config/routes";
import { errorHandler } from "./utils/error-handle.middleware";
import { httpLogger } from "./utils/http-logger.middleware";
import { logger } from "./utils/logger";

const server = Fastify({
  logger: false,
});

server.setErrorHandler(errorHandler);
server.addHook("onRequest", httpLogger);

server.get("/health", async () => ({ status: "ok" }));

const start = async () => {
  try {
    await AppDataSource.initialize();
    logger.info("Database connected successfully");

    await registerRoutes(server);
    logger.info("Routes registered successfully");

    await server.listen({ port: env.PORT });
    logger.info(`Server running on port ${env.PORT}`);
  } catch (err) {
    logger.error("Failed to start server", { error: err instanceof Error ? err.stack : err });
    // console.error(err);
    // process.exit(1);
  }
};

process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception", { error: error instanceof Error ? error.stack : error });
  // process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled Rejection", { error: reason instanceof Error ? reason.stack : reason });
  // process.exit(1);
});

start();
