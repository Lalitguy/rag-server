import type { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";
import { embedText } from "../services/embedding.service";

export async function getUserHandler(
  this: FastifyInstance,
  _req: FastifyRequest,
  reply: FastifyReply
) {
  const ff = await embedText(
    "Fastify is a fast and easy to use, modern web framework for Node.js."
  );

  return reply.send({ ff });
  return;
  const user = await this.mongo.db?.collection("vectors").findOne();

  if (!user) {
    return reply.status(404).send({ error: "User not found" });
  }

  return reply.send(user);
}
