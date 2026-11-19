import { db } from "../config/database.js";
import { searchDocuments } from "../retrieval/search.js";

async function main() {
  const question = process.argv.slice(2).join(" ");

  if (!question) {
    throw new Error("Provide a question");
  }

  try {
    const results = await searchDocuments(question);

    console.log(`\nQuestion: ${question}`);
    console.log(`\nFound ${results.length} relevant chunks:\n`);

    results.forEach((result, index) => {
      console.log(`--- Result ${index + 1} ---`);
      console.log("File:", result.filename);
      console.log("Chunk:", result.chunk_index);
      console.log("Similarity:", Number(result.similarity).toFixed(4));
      console.log("Content:", result.content);
      console.log();
    });
  } finally {
    await db.end();
  }
}

main().catch(console.error);
