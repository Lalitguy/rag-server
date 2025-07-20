import type { FastifyInstance } from "fastify";
import { userRoutes } from "./user.route";

export function registerRoutes(app: FastifyInstance) {
  app.get("/health", async () => {
    return { status: "ok" };
  });

  // Register more route groups here
  app.register(userRoutes, { prefix: "/users" });
}
