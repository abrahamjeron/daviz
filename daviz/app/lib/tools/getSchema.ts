import { getDb } from "./getDB";
import { tool } from "langchain";

// implement the real work as a normal function
export async function getSchemaImpl() {
  const db = await getDb();
  return db.getTableInfo();
}

// export the tool-wrapped object for your framework/agent
export const getSchema = tool(getSchemaImpl, {
  name: "get_schema",
  description: "Return the database schema / table info (read-only).",
});

// use the impl directly when running locally / in file
// (async () => {
//   try {
//     const schema = await getSchemaImpl();
//     console.log(schema);
//   } catch (err) {
//     console.error("getSchemaImpl failed:", err);
//   }
// })();
// 