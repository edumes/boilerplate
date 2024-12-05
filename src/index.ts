import Fastify from "fastify";
import { AppDataSource } from "./config/database";
import { registerRoutes } from "./config/routes";
import { env } from "./config/env";

const server = Fastify({ logger: true });

server.get("/health", async () => ({ status: "ok" }));

const start = async () => {
  try {
    await AppDataSource.initialize();
    server.log.info("Database connected!");

    await registerRoutes(server);

    await server.listen({ port: env.PORT });
    server.log.info(`Server running ${env.PORT}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
