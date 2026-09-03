import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("DATABASE_URL is not set in environment variables.");
  process.exit(1);
}

const sql = postgres(connectionString, { max: 1 });
const db = drizzle(sql);

async function main() {
  console.log("⏳ Menjalankan migrasi database...");
  await migrate(db, { migrationsFolder: "./drizzle" });
  console.log("✅ Migrasi database berhasil diterapkan!");
  await sql.end();
  process.exit(0);
}

main().catch(async (err) => {
  console.error("❌ Migrasi gagal:", err);
  await sql.end();
  process.exit(1);
});
