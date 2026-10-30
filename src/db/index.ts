import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/storeswift";

if (!process.env.DATABASE_URL && process.env.NODE_ENV === "production") {
  console.error("[DB] WARNING: DATABASE_URL environment variable is not set. Using fallback connection string.");
}

// Disable prefetch as it is not supported for "Transaction" pool mode
const client = postgres(connectionString, {
  prepare: false,
  max: 10
});

export const db = drizzle(client, { schema });
export * from "./schema";
export * from "./tenant";
