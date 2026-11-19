
import path from "path";
import { db } from "../config/database.js";
import { extractText } from "./extract.js";
import { chunkText } from "./chunk.js";
import { generateEmbedding } from "./embed.js";

export async function ingestPDF(filePath: string) {
  const client = await db.connect();

  try {
    await client.query("BEGIN");

    // 1. Extract PDF text
    console.log("Extracting PDF text...");
    const result = await extractText(filePath);

    // 2. Split text into chunks
    console.log("Splitting text into chunks...");
    const chunks = chunkText(result.text);

    // 3. Create document record
    const filename = path.basename(filePath);

    const documentResult = await client.query(
      `INSERT INTO documents (filename)
       VALUES ($1)
       RETURNING id`,
      [filename],
    );

    const documentId = documentResult.rows[0].id;

    // 4. Generate embeddings and store chunks
    console.log(`Generating embeddings for ${chunks.length} chunks...`);

    for (let i = 0; i < chunks.length; i++) {
      const embedding = await generateEmbedding(chunks[i]);

      await client.query(
        `INSERT INTO document_chunks
         (document_id, chunk_index, content, embedding)
         VALUES ($1, $2, $3, $4::vector)`,
        [documentId, i, chunks[i], JSON.stringify(embedding)],
      );

      console.log(`Processed chunk ${i + 1}/${chunks.length}`);
    }

    await client.query("COMMIT");

    console.log("\nIngestion completed!");
    console.log("Document ID:", documentId);
    console.log("Filename:", filename);
    console.log("Total chunks:", chunks.length);
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
