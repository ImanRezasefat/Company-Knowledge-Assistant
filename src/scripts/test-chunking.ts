import { chunkText } from "../ingestion/chunk.js";
import { extractText } from "../ingestion/extract.js";


async function main() {
  const filePath = process.argv[2];

  if (!filePath) {
    throw new Error("Provide a PDF file path");
  }

  const result = await extractText(filePath);
  const chunks = chunkText(result.text);

  console.log("Total chunks:", chunks.length);

  chunks.forEach((chunk, index) => {
    console.log(`\n--- Chunk ${index + 1} ---`);
    console.log(chunk);
    console.log("Characters:", chunk.length);
  });
}

main().catch(console.error);
