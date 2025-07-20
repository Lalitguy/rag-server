import type { FastifyInstance } from "fastify";
import { getUserHandler } from "../controllers/user.controller";
import { logRequestMiddleware } from "../middlewares/logger.middleware";

export async function userRoutes(app: FastifyInstance) {
  app.get("/:id", {
    preHandler: logRequestMiddleware,
    handler: getUserHandler,
  });
}
