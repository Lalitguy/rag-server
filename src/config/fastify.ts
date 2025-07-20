import cors from "@fastify/cors";
import type { FastifyInstance } from "fastify";
import Fastify from "fastify";
import mongoPlugin from "../plugins/mongodb";
import { registerRoutes } from "../routes/index.route";

export function createServer(): FastifyInstance {
  const app = Fastify({
    logger: true, // You can customize this as needed
  });

  // Register core plugins
  app.register(cors, {
    origin: "*", // You can restrict this in production
  });

  app.register(mongoPlugin);

  // Register all routes
  app.register(registerRoutes);

  return app;
}
