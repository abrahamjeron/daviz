import { tool } from "langchain"
import * as z from "zod";
import { sanitizeSqlQuery } from "../safe_SQL";
import { getDb } from "./getDB"

export const executeSql = tool(
  async ({ query }) => {
    const q = sanitizeSqlQuery(query);
    try {
      const database = await getDb();  
      const result = await database.run(q);  
      return typeof result === "string" ? result : JSON.stringify(result, null, 2);
    } catch (e) {
      throw new Error(e instanceof Error ? e.message : String(e))
    }
  },
  {
    name: "execute_sql",
    description: "Execute a READ-ONLY SQLite SELECT query and return the results.",
    schema: z.object({
      query: z.string().describe("SQLite SELECT query to execute (read-only)."),
    }),
  }
);