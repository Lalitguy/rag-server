import type { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";
import { semanticSearch } from "../services/semantic-search.service";
import { ragSearch } from "../services/rag-search.service";

export async function searchHandler(
  this: FastifyInstance,
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { prompt } = request.body as {
    prompt: string;
  };

  try {
    const searchResult = await semanticSearch(this, prompt);

    const result = await ragSearch(prompt, searchResult || []);

    return reply.send({ success: true, result: result });
  } catch (err) {
    reply.status(500).send({ error: "Embedding failed" });
  }
}
