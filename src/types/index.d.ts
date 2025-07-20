import type { FastifyMongoObject } from "@fastify/mongodb";

declare module "fastify" {
  interface FastifyRequest {
    mongo: FastifyMongoObject;
  }
}
