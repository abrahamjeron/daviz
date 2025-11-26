import { SqlDatabase } from "@langchain/classic/sql_db";
import { DataSource } from "typeorm";
import {resolveDbPath} from "../db";

let db: SqlDatabase | undefined;
export async function getDb() {
  if (!db) {
    const dbPath = await resolveDbPath();
    const datasource = new DataSource({ type: "sqlite", database: dbPath });
    db = await SqlDatabase.fromDataSourceParams({ appDataSource: datasource });
  }
  return db;
}

// app/lib/tools/getDB.ts
// import { SqlDatabase } from "@langchain/classic/sql_db";
// import { DataSource } from "typeorm";
// import { resolveDbPath } from "../db";

// let db: SqlDatabase | undefined;

// export async function getDb() {
//   if (!db) {
//     try {
//       const dbPath = await resolveDbPath();
//       const datasource = new DataSource({ type: "sqlite", database: dbPath });
//       db = await SqlDatabase.fromDataSourceParams({ appDataSource: datasource });
//     } catch (error) {
//       // Return a mock database for testing
//       console.warn("⚠️ Using mock database (real DB not found)");
      
//       db = {
//         run: async (query: string) => {
//           return JSON.stringify([
//             { genre: "Rock", avg_duration: 245 },
//             { genre: "Jazz", avg_duration: 320 },
//             { genre: "Classical", avg_duration: 450 }
//           ]);
//         },
//         getTableInfo: async () => {
//           return `
//             TABLE: tracks
//             - id INTEGER PRIMARY KEY
//             - name TEXT
//             - genre TEXT
//             - duration INTEGER
            
//             TABLE: genres
//             - id INTEGER PRIMARY KEY
//             - name TEXT
//           `;
//         }
//       } as any;
//     }
//   }
//   return db;
// }