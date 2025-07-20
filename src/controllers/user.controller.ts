import type { FastifyRequest, FastifyReply } from "fastify";

export async function getUserHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  reply.send(Object.keys(request));
  const user = await request.mongo.db?.collection("vectors").findOne();

  if (!user) {
    return reply.status(404).send({ error: "User not found" });
  }

  return reply.send(user);
}
