// app/lib/db.ts
import { Pool } from "pg";

// Use a Pool to avoid top-level connect promises and to safely reuse connections.
const pool = new Pool({
  connectionString: "postgresql://abra:yourpassword@localhost:5432/local_fyule_db_current?schema=public",
});

export async function executeQuery<T = any>(sql: string): Promise<T[]> {
  const result = await pool.query(sql);
  return result.rows as T[];
}

// Functions for handling database configuration for LangChain

import fs from "node:fs/promises";
import path from "node:path";

const url = "";
const localPath = path.resolve("/home/manoj-gowda-n/daviz/daviz/metric_store.db");

export async function resolveDbPath() {
  // try {
  //   await fs.access(localPath);
  //   return localPath;
  // } catch {
  //   // File doesn't exist, fetch it
  //     const resp = await fetch(url);
  //     if (!resp.ok) throw new Error(`Failed to fetch DB. Status code: ${resp.status}`);
  //     const buf = Buffer.from(await resp.arrayBuffer());
  //     await fs.writeFile(localPath, buf); 
  //     return localPath;
  // }
  await fs.access(localPath);
  return localPath;

}