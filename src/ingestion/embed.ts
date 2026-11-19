import ollama from "ollama";

export async function generateEmbedding(text: string): Promise<number[]> {
  const response = await ollama.embed({
    model: "nomic-embed-text",
    input: text,
  });

  return response.embeddings[0];
}
