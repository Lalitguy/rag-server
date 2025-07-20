import type { FastifyReply, FastifyRequest } from "fastify";

export async function getUserHandler(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  const { id } = request.params;

  // Simulate fetching user
  const user = { id, name: `User ${id}` };
  return reply.send(user);
}
