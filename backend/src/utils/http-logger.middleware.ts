import { FastifyReply, FastifyRequest } from "fastify";
import { logger } from "./logger";

export async function httpLogger(request: FastifyRequest, reply: FastifyReply) {
  const startTime = Date.now();

  reply.raw.on("finish", () => {
    const duration = Date.now() - startTime;

    logger.http({
      method: request.method,
      url: request.url,
      status: reply.statusCode,
      duration: `${duration}ms`,
      userAgent: request.headers["user-agent"],
      ip: request.ip,
    });
  });
}
