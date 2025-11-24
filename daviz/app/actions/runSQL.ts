// src/app/actions/runSQL.ts
"use server";

import { executeQuery } from "../lib/db";

export async function runSQL(query: string) {
  const rows = await executeQuery(query);
  return rows;
}
