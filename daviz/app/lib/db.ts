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
