import { getDb } from "./getDB";
import { tool } from "langchain";

// Store dbUri for this tool context
let currentDbUri: string = "";

export function setGetSchemaDbUri(dbUri: string) {
  currentDbUri = dbUri;
}

// implement the real work as a normal function
export async function getSchemaImpl() {
  if (!currentDbUri) {
    throw new Error("Database URI not set. Please initialize the schema tool with setGetSchemaDbUri()");
  }
  
  const db = await getDb(currentDbUri);
  return db.getTableInfo();
}

// export the tool-wrapped object for your framework/agent
export const getSchema = tool(getSchemaImpl, {
  name: "get_schema",
  description: "Return the database schema / table info (read-only).",
});