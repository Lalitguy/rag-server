// services/mistral.service.ts
import { Mistral } from "@mistralai/mistralai";
import type { VectorDocument } from "../types";
import { ENV } from "../config/env";
import type { FastifyReply } from "fastify";

const mistralClient = new Mistral({
  apiKey: ENV.MISTRAL_API_KEY,
});

export async function ragSearch(
  query: string,
  contextDocs: VectorDocument[],
  reply?: FastifyReply,
  model = "mistral-medium"
) {
  const contextString = contextDocs
    .map((doc, index) => {
      return `Source ${index + 1}:
Title: ${doc.title}
Description: ${doc.description}${doc.link ? `\nLink: ${doc.link}` : ""}`;
    })
    .join("\n\n");

  const systemPrompt = `
You are a helpful and professional assistant.

When answering user questions, prioritize the information provided in the context. Use your own knowledge only when it is highly relevant, accurate, and up to date — and only to complement the context, not replace it.

Ensure your response directly addresses the user's query using the most relevant parts of the context. Do not restate or summarize the context. Avoid guessing or making up information.

If the context is not sufficient, and you do not have a confidently accurate and relevant answer from your own knowledge, respond with:
"I don't have enough information to answer that based on the given sources."

If a document includes a link and it appears relevant to the query, include the link in your response with a brief sentence such as:
"You can refer to the following link for more information: [link]".

Your response must be:
- Written as a clear, well-structured paragraph in natural, human-readable language.
- Professional in tone, concise, and informative.
- Approximately 60 to 300 words in length. If the available context is too limited to generate a response of that length, you may respond in fewer words — but clearly indicate that the information provided is minimal due to limited context.
.  
  `.trim();

  const userPrompt = `
Answer the following question using the context:

User Question:
${query}

Context:
${contextString}
  `.trim();

  try {
    if (reply) {
      const stream = await mistralClient.chat.stream({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
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
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      });

      return (
        response?.choices?.[0]?.message?.content?.toString() ||
        "No response received."
      );
    }
  } catch (err) {
    return "No response received.";
  }
}
