import type { FastifyInstance } from "fastify";
import { embedHandler } from "../controllers/embed.controller";

export function embedRoutes(app: FastifyInstance) {
  app.post("/", {
    handler: embedHandler,
  });
}
