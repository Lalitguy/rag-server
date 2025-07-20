import type { FastifyInstance } from "fastify";

export async function userRoutes(app: FastifyInstance) {
  app.get("/", async (request, reply) => {
    return [{ id: 1, name: "Alice" }];
  });

  app.get("/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    return { id, name: "User " + id };
  });
}
