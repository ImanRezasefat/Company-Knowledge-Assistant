import { extractText } from "../ingestion/extract.js";

async function main() {
  const filePath = process.argv[2];

  if (!filePath) {
    throw new Error("Provide a PDF file path");
  }

  const result = await extractText(filePath);

  console.log("Pages:", result.pages);
  console.log("\nExtracted text:\n");
  console.log(result.text.slice(0, 3000));
  console.log("\nTotal characters:", result.text.length);
}

main().catch(console.error);
