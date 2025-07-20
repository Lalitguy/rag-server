import type { FastifyRequest, FastifyReply } from "fastify";

export async function logRequestMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
) {
  console.log(`[${request.method}] ${request.url}`);
}
