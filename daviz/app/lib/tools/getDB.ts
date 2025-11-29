import { SqlDatabase } from "@langchain/classic/sql_db";
import { DataSource } from "typeorm";

let dbCache: Map<string, SqlDatabase> = new Map();

export async function getDb(dbUri: string) {
  // Check cache first
  if (dbCache.has(dbUri)) {
    return dbCache.get(dbUri)!;
  }

  try {
    // Parse the dbUri to determine database type and create appropriate DataSource
    let datasource: DataSource;
    console.log("Connecting to database with URI:", dbUri);
    if (dbUri.startsWith("sqlite")) {
      // Extract path from sqlite:///path/to/db.db
      const dbPath = dbUri.replace("sqlite:///", "");
      datasource = new DataSource({ 
        type: "sqlite",
        database: dbPath,
      });
    } else {
      // For PostgreSQL, MySQL, etc., use the URL directly
      datasource = new DataSource({ 
        type: "postgres",
        url: dbUri,
      });
    }
    
    // Initialize the DataSource before using it
    await datasource.initialize();
    
    const db = await SqlDatabase.fromDataSourceParams({ appDataSource: datasource });
    dbCache.set(dbUri, db);
    return db;
  } catch (error) {
    console.error("Error connecting to database:", error);
    throw new Error(`Failed to connect to database at ${dbUri}: ${error instanceof Error ? error.message : String(error)}`);
  }
}