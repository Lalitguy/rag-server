import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { getVectorCollection } from "../models/vector.model";
import { ObjectId } from "@fastify/mongodb";
import type { KnowledgeDoc } from "../types";
import { embedText } from "../services/embedding.service";

export async function allKnowledge(
  this: FastifyInstance,
  _req: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const collection = getVectorCollection(this);

    const result = await collection
      .find({}, { projection: { embedding: 0 } })
      .toArray();
    return reply.send({ success: true, data: result });
  } catch (err) {
    reply.status(500).send({ error: "Something went wrong" });
  }
}

export async function knowledgeId(
  this: FastifyInstance,
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = request.params as {
    id: string;
  };

  try {
    const collection = getVectorCollection(this);

    const result = await collection.findOne(
      { _id: new ObjectId(id) },
      { projection: { embedding: 0 } }
    );
    return reply.send({ success: true, data: result });
  } catch (err) {
    reply.status(500).send({ error: "Something went wrong" });
  }
}

export async function knowledgeUpdate(
  this: FastifyInstance,
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = request.params as { id: string };
  const updates = request.body as KnowledgeDoc;

  try {
    const collection = getVectorCollection(this);

    const { title, description, link } = updates;

    const input = `${title}\n\n${description}${link ? `\n\n${link}` : ""}`;
    const embedding = await embedText(input);

    const doc = { ...updates, embedding };

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: doc }
    );

    if (result.matchedCount === 0) {
      return reply
        .status(404)
        .send({ success: false, message: "Document not found" });
    }

    return reply.send({ success: true, updatedCount: result.modifiedCount });
  } catch (err) {
    reply.status(500).send({ error: "Something went wrong" });
  }
}
