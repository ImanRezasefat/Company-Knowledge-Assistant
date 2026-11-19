import { db } from "../config/database.js";
import { ingestPDF } from "../ingestion/ingest.js";


async function main() {
  const filePath = process.argv[2];

  if (!filePath) {
    throw new Error("Provide a PDF file path");
  }

  try {
    await ingestPDF(filePath);
  } finally {
    await db.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
