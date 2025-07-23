import type { FastifyInstance } from "fastify";
import { embedHandler } from "../controllers/embed.controller";
import { logRequestMiddleware } from "../middlewares/logger.middleware";

export function embedRoutes(app: FastifyInstance) {
  app.post("/embed", {
    handler: embedHandler,
  });
}
