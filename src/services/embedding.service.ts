import { pipeline } from "@xenova/transformers";

let embedder: any = null;

export async function getEmbedder() {
  if (!embedder) {
    embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  }
  return embedder;
}

export async function embedText(input: string): Promise<number[]> {
  const model = await getEmbedder();
  const output = await model(input, { pooling: "mean", normalize: true });
  return Array.from(output.data);
}
