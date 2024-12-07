import { FastifyInstance } from "fastify";
import { readdir } from "fs/promises";
import path from "path";
import { User } from "../modules/users/user.entity";
import { logger } from "../utils/logger";

declare module "fastify" {
  interface FastifyRequest {
    user?: User;
    token?: string;
  }
}

// Define a interface para o controller com assinaturas explícitas
interface GenericController {
  findAll: (request: any, reply: any) => Promise<void> | void;
  findById: (request: any, reply: any) => Promise<void> | void;
  findByConditions: (request: any, reply: any) => Promise<void> | void;
  create: (request: any, reply: any) => Promise<void> | void;
  update: (request: any, reply: any) => Promise<void> | void;
  delete: (request: any, reply: any) => Promise<void> | void;
  search: (request: any, reply: any) => Promise<void> | void;
  count: (request: any, reply: any) => Promise<void> | void;
  clone: (request: any, reply: any) => Promise<void> | void;
}

/**
 * Recupera todos os arquivos de rota em um diretório e subdiretórios.
 * Apenas arquivos que terminam com ".routes.ts" são retornados.
 */
async function* getRouteFiles(dir: string): AsyncGenerator<string> {
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      yield* getRouteFiles(fullPath);
    } else if (
      entry.isFile() &&
      (entry.name.endsWith(".routes.ts") || entry.name.endsWith(".routes.js"))
    ) {
      yield fullPath;
    }
  }
}

/**
 * Registra rotas automaticamente no servidor Fastify.
 * Os arquivos de rota devem exportar uma função padrão.
 */
export async function registerRoutes(server: FastifyInstance) {
  const modulesPath = path.join(__dirname, "../modules");

  for await (const routeFile of getRouteFiles(modulesPath)) {
    const routeModule = await import(routeFile);

    // Deriva o prefixo com base no diretório pai do arquivo de rota
    const routePrefix = path
      .relative(modulesPath, routeFile)
      .replace(/\\/g, "/")
      .split("/")[0]
      .toLowerCase(); // Normaliza o prefixo para lowercase

    // Sanitiza o prefixo para segurança
    const sanitizedPrefix = encodeURIComponent(routePrefix);

    logger.info(`registered route ${sanitizedPrefix}`);
    server.register(routeModule.default, {
      prefix: `/api/v1/${sanitizedPrefix}`,
    });
  }
}

/**
 * Registra rotas CRUD genéricas para uma entidade específica.
 */
export function registerGenericRoutes(
  server: FastifyInstance,
  controller: GenericController
) {
  server.get("/", controller.findAll.bind(controller));
  server.get("/filter", controller.findByConditions.bind(controller));
  server.get("/:id", controller.findById.bind(controller));
  server.post("/", controller.create.bind(controller));
  server.put("/:id", controller.update.bind(controller));
  server.delete("/:id", controller.delete.bind(controller));
  server.get("/search", controller.search.bind(controller));
  server.get("/count", controller.count.bind(controller));
  server.post("/:id/clone", controller.clone.bind(controller));
}
