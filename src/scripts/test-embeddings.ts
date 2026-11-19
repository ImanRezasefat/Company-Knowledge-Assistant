import { generateEmbedding } from "../ingestion/embed.js";

async function main() {
  const text = "Employees receive 20 days of annual leave.";

  const embedding = await generateEmbedding(text);

  console.log("Embedding dimensions:", embedding.length);
  console.log("First 10 values:", embedding.slice(0, 10));
}

main().catch(console.error);
