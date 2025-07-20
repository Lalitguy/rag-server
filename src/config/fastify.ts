import Fastify from "fastify";
import type { FastifyInstance } from "fastify";
import cors from "@fastify/cors";
import { registerRoutes } from "../routes/index.route";

export function createServer(): FastifyInstance {
  const app = Fastify({
    logger: true, // You can customize this as needed
  });

  // Register core plugins
  app.register(cors, {
    origin: "*", // You can restrict this in production
  });

  // Register all routes
  registerRoutes(app);

  return app;
}
