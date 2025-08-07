// services/mistral.service.ts
import { Mistral } from "@mistralai/mistralai";
import type { VectorDocument } from "../types";
import { ENV } from "../config/env";
import type { FastifyReply } from "fastify";
import {
  ragRolePrompt,
  systemNoRagPrompt,
  systemRagPrompt,
} from "../utils/rolePrompt";

const mistralClient = new Mistral({
  apiKey: ENV.MISTRAL_API_KEY,
});

interface RagPromptOptions {
  query: string;
  contextDocs: VectorDocument[];
  reply?: FastifyReply;
  model?: "mistral-medium";
  rag?: boolean;
}
export async function ragSearch({
  query,
  contextDocs,
  reply,
  model = "mistral-medium",
  rag = true,
}: RagPromptOptions) {
  const contextString = contextDocs
    .map((doc, index) => {
      return `Source ${index + 1}:
Title: ${doc.title}
Description: ${doc.description}${doc.link ? `\nLink: ${doc.link}` : ""}`;
    })
    .join("\n\n");

  try {
    if (!rag) {
      console.log("here i am --------------------------");
      console.log(query);
      const response = await mistralClient.chat.complete({
        model,
        messages: [
          { role: "system", content: systemNoRagPrompt },
          { role: "user", content: query },
        ],
      });

      console.log("------------------ no ?");
      console.log(response?.choices?.[0]);

      return (
        response?.choices?.[0]?.message?.content?.toString() ||
        "No response received."
      );
    } else {
      if (reply) {
        const stream = await mistralClient.chat.stream({
          model,
          messages: [
            { role: "system", content: systemRagPrompt },
            { role: "user", content: ragRolePrompt({ query, contextString }) },
          ],
        });

        for await (const event of stream) {
          const content = event.data?.choices[0]?.delta.content;
          if (!content) {
            continue;
          }
          reply.raw.write(content);
        }
        reply.raw.end();
      } else {
        const response = await mistralClient.chat.complete({
          model,
          messages: [
            { role: "system", content: systemRagPrompt },
            { role: "user", content: ragRolePrompt({ query, contextString }) },
          ],
        });

        return (
          response?.choices?.[0]?.message?.content?.toString() ||
          "No response received."
        );
      }
    }
  } catch (err) {
    return "No response received.";
  }
}
