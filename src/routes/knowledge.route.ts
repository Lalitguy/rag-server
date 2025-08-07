import type { FastifyInstance } from "fastify";
import {
  allKnowledge,
  knowledgeId,
  knowledgeUpdate,
} from "../controllers/knowledge.controller";

export function knowledgeRoutes(app: FastifyInstance) {
  app.get("/", {
    handler: allKnowledge,
  });
  app.get("/:id", {
    handler: knowledgeId,
  });
  app.patch("/update/:id", {
    handler: knowledgeUpdate,
  });
}
