import type { FastifyInstance } from "fastify";
import { embedText } from "./embedding.service";
import type { VectorDocument } from "../types";
import { getVectorCollection } from "../models/vector.model";

export async function semanticSearch(
  app: FastifyInstance,
  query: string
): Promise<VectorDocument[] | null> {
  const embedding = await embedText(query);
  const collection = getVectorCollection(app);

  if (!collection) throw new Error("MongoDB collection not found");

  const results = (await collection
    .aggregate([
      {
        $vectorSearch: {
          queryVector: embedding,
          path: "embedding",
          numCandidates: 50,
          limit: 5,
          index: "embedding_index",
        },
      },
      {
        $addFields: { score: { $meta: "vectorSearchScore" } },
      },
      {
        $match: { score: { $gte: 0.7 } },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          description: 1,
          link: 1,
          createdAt: 1,
          score: { $meta: "vectorSearchScore" },
        },
      },
    ])
    .toArray()) as VectorDocument[];

  return results ?? null;
}
