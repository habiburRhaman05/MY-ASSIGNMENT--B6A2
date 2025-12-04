// src/config/db.ts
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Optional: Test the connection on startup
export const connectDatabase = async () => {
  try {
    const client = await pool.connect();
    client.release();
    console.log("✅ Connected to PostgreSQL");
  } catch (err) {
    console.error("❌ DB connection failed:", err);
    process.exit(1);
  }
};
