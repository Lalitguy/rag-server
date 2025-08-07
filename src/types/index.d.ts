import "fastify";
import { FastifyMongoObject, ObjectId } from "@fastify/mongodb";

declare module "fastify" {
  interface FastifyInstance {
    mongo: FastifyMongoObject;
  }
}

export interface VectorDocument {
  _id?: ObjectId;
  title: string;
  description: string;
  link?: string;
  embedding: number[];
  createdAt: Date;
}

export interface KnowledgeDoc {
  title: string;
  description: string;
  link?: string;
}

export interface KnowledgeDocWithId extends KnowledgeDoc {
  _id: ObjectId;
}
