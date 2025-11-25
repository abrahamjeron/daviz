import {getDb} from "./getDB"

export async function getSchema() {
  const db = await getDb();
  return await db.getTableInfo();
}