import { db } from "../config/database.js";
import { generateEmbedding } from "../ingestion/embed.js";


export async function searchDocuments(question: string, limit = 5) {
  const embedding = await generateEmbedding(question);

  const result = await db.query(
    `SELECT
       dc.id,
       dc.document_id,
       dc.chunk_index,
       dc.content,
       d.filename,
       1 - (dc.embedding <=> $1::vector) AS similarity
     FROM document_chunks dc
     JOIN documents d ON d.id = dc.document_id
     WHERE dc.embedding IS NOT NULL
     ORDER BY dc.embedding <=> $1::vector
     LIMIT $2`,
    [JSON.stringify(embedding), limit],
  );

  return result.rows;
}
