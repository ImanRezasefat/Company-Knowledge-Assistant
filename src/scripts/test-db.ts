import { db } from "../config/database.js";

async function testConnection() {
  try {
    const result = await db.query("SELECT NOW() AS current_time");

    console.log("Database connected successfully!");
    console.log("Server time:", result.rows[0].current_time);

    const version = await db.query("SELECT version()");
    console.log("PostgreSQL:", version.rows[0].version);
  } catch (error) {
    console.error("Database connection failed:", error);
  } finally {
    await db.end();
  }
}

testConnection();
