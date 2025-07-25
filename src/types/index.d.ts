import "fastify";
import { FastifyMongoObject } from "@fastify/mongodb";

declare module "fastify" {
  interface FastifyInstance {
    mongo: FastifyMongoObject;
  }
}

export interface VectorDocument {
  _id?: string;
  title: string;
  description: string;
  link?: string;
  embedding: number[];
  createdAt: Date;
}
