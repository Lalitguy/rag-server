import type { FastifyInstance } from "fastify";
import type { VectorDocument } from "../types";

export function getVectorCollection(app: FastifyInstance) {
  return app.mongo.db!.collection<VectorDocument>("vectors");
}
