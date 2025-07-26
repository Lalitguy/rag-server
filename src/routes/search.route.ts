import type { FastifyInstance } from "fastify";
import { searchHandler } from "../controllers/search.controller";

export function searchRoutes(app: FastifyInstance) {
  app.post("/", {
    handler: searchHandler,
  });
}
