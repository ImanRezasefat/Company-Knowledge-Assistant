import { db } from "../config/database.js";
import { searchDocuments } from "../retrieval/search.js";
import { generateAnswer } from "../generation/generate.js";

async function main() {
  const question = process.argv.slice(2).join(" ");

  if (!question) {
    throw new Error("Provide a question");
  }

  try {
    console.log("\nSearching knowledge base...\n");

    const results = await searchDocuments(question, 5);

    if (!results.length) {
      console.log("No relevant information found.");
      return;
    }

    const context = results.map((result) => result.content);

    console.log(`Retrieved ${results.length} chunks.`);
    console.log("\nGenerating answer...\n");

    const answer = await generateAnswer({ question, context });

    console.log("Question:", question);
    console.log("\nAnswer:\n");
    console.log(answer);
  } finally {
    await db.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
