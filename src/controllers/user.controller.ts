import type { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";

export async function getUserHandler(
  this: FastifyInstance,
  _req: FastifyRequest,
  reply: FastifyReply
) {
  const user = await this.mongo.db?.collection("vectors").findOne();

  if (!user) {
    return reply.status(404).send({ error: "User not found" });
  }

  return reply.send(user);
}
