// routes/index.route.ts
import type { FastifyInstance } from "fastify";
import { embedRoutes } from "./embed.route";
import { searchRoutes } from "./search.route";
import { knowledgeRoutes } from "./knowledge.route";

export function registerRoutes(app: FastifyInstance) {
  app.get("/health", async () => {
    return { status: "ok" };
  });
  app.register(embedRoutes, { prefix: "/embed" });
  app.register(searchRoutes, { prefix: "/search" });
  app.register(knowledgeRoutes, { prefix: "/knowledge" });
}
