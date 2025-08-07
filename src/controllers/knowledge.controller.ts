import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { getVectorCollection } from "../models/vector.model";
import { ObjectId } from "@fastify/mongodb";
import type { KnowledgeDoc } from "../types";

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
  const updates = request.body as Partial<KnowledgeDoc>;

  console.log(id, updates);
  try {
    const collection = getVectorCollection(this);
    console.log(updates);
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updates }
    );

    if (result.matchedCount === 0) {
      console.log("errrooooooooooooooore ----------------");
      return reply
        .status(404)
        .send({ success: false, message: "Document not found" });
    }

    console.log("----------------------ist SUckkkesss");
    return reply.send({ success: true, updatedCount: result.modifiedCount });
  } catch (err) {
    console.log(err);
    reply.status(500).send({ error: "Something went wrong" });
  }
}
