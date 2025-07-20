import type { FastifyInstance } from "fastify";
import { getUserHandler } from "../controllers/user.controller";
import { logRequestMiddleware } from "../middlewares/logger.middleware";

export function userRoutes(app: FastifyInstance) {
  app.get("/", {
    preHandler: logRequestMiddleware,
    handler: getUserHandler,
  });
}
