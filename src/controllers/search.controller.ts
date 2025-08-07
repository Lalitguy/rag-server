import type { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";
import { semanticSearch } from "../services/semantic-search.service";
import { ragSearch } from "../services/rag-search.service";

export async function searchHandler(
  this: FastifyInstance,
  request: FastifyRequest,
  reply: FastifyReply
) {
  const {
    prompt,
    stream,
    rag = true,
  } = request.body as {
    prompt: string;
    stream?: boolean;
    rag: boolean;
  };

  try {
    if (!rag) {
      const result = await ragSearch({
        query: prompt,
        contextDocs: [],
        rag: false,
      });
      return reply.send({ success: true, data: result });
    } else {
      const searchResult = await semanticSearch(this, prompt);
      if (stream) {
        reply.raw.setHeader("Content-Type", "text/event-stream");
        reply.raw.setHeader("Cache-Control", "no-cache");
        reply.raw.setHeader("Connection", "keep-alive");
        reply.raw.flushHeaders?.();
        await ragSearch({
          query: prompt,
          contextDocs: searchResult || [],
          reply,
        });
      } else {
        const result = await ragSearch({
          query: prompt,
          contextDocs: searchResult || [],
        });
        return reply.send({ success: true, data: result });
      }
    }
  } catch (err) {
    reply.status(500).send({ error: "Embedding failed" });
  }
}
