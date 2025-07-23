import type { FastifyRequest, FastifyReply } from "fastify";
import { embedText } from "../services/embedding.service";

export async function embedHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { title, description, link } = request.body as {
    title: string;
    description: string;
    link?: string;
  };

  const input = `${title}\n\n${description}${link ? `\n\n${link}` : ""}`;

  try {
    const embedding = await embedText(input);
    return reply.send({ embedding });
  } catch (err) {
    reply.status(500).send({ error: "Embedding failed" });
  }
}
