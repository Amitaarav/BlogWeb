import "dotenv/config";
import pg from "pg";

const { Client } = pg;

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 10000,
});

try {
  console.log("Connecting to:", new URL(process.env.DATABASE_URL).hostname);

  await client.connect();

  const result = await client.query("SELECT 1");

  console.log("Database connection successful");
  console.log(result.rows);
} catch (error) {
  console.error("Database connection failed");
  console.error(error);
} finally {
  await client.end().catch(() => {});
}