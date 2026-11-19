import { db } from "../config/database.js";

async function setupDatabase() {
  try {
    await db.query("CREATE EXTENSION IF NOT EXISTS vector");

    await db.query(`
      CREATE TABLE IF NOT EXISTS documents (
        id SERIAL PRIMARY KEY,
        filename TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS document_chunks (
        id SERIAL PRIMARY KEY,
        document_id INTEGER REFERENCES documents(id) ON DELETE CASCADE,
        chunk_index INTEGER NOT NULL,
        content TEXT NOT NULL,
        embedding VECTOR(768),
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    console.log("Database schema created successfully!");

    const result = await db.query(
      "SELECT extname FROM pg_extension WHERE extname = 'vector'",
    );

    console.log("pgvector enabled:", result.rowCount === 1);
  } catch (error) {
    console.error("Database setup failed:", error);
  } finally {
    await db.end();
  }
}

setupDatabase();
