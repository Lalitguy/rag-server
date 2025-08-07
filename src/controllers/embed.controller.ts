import type { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";
import { embedText } from "../services/embedding.service";
import { getVectorCollection } from "../models/vector.model";
import type { KnowledgeDoc } from "../types";

export async function embedHandler(
  this: FastifyInstance,
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { title, description, link } = request.body as KnowledgeDoc;

  const input = `${title}\n\n${description}${link ? `\n\n${link}` : ""}`;

  try {
    const embedding = await embedText(input);
    const vectorDoc = {
      title,
      description,
      link,
      embedding,
      createdAt: new Date(),
    };

    const collection = getVectorCollection(this);
    await collection.insertOne(vectorDoc);

    return reply.send({ success: true });
  } catch (err) {
    reply.status(500).send({ error: "Embedding failed" });
  }
}
