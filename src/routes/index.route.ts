// routes/index.route.ts
import type { FastifyInstance } from "fastify";
import { userRoutes } from "./user.route";
import { embedRoutes } from "./embed.route";

export function registerRoutes(app: FastifyInstance) {
  app.get("/health", async () => {
    return { status: "ok" };
  });
  app.register(userRoutes, { prefix: "/users" });
  app.register(embedRoutes, { prefix: "/embed" });
}
