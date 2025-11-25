/**
 * Type definitions for Daviz - AI-powered data visualizer component
 * 
 * Uses LangChain SQL Agent for database interactions
 * No direct database connections needed in the component
 */

// ============ Database Configuration for LangChain SQL Agent ============

/**
 * Database URI format for LangChain SQL Agent
 * 
 * Supported formats:
 * - PostgreSQL: postgresql://username:password@localhost:5432/database_name
 * - MySQL: mysql+pymysql://username:password@localhost:3306/database_name
 * - SQLite: sqlite:///path/to/database.db
 * - MongoDB: mongodb+srv://username:password@cluster0.mongodb.net/database_name
 * - MSSQL: mssql+pyodbc://username:password@servername:1433/database_name?driver=ODBC+Driver+17+for+SQL+Server
 * 
 * @see https://docs.langchain.com/oss/python/langchain/sql-agent#2-configure-the-database
 */
export type DatabaseURI = string;

// ============ Chart Configuration ============

export type ChartType = "line" | "bar" | "pie" | "area";

export interface ChartConfig {
  chartType: ChartType;
  xField?: string;
  yField?: string;
  seriesField?: string;
  height?: number;
}

export interface TransformedChartData {
  xAxis?: (string | number)[];
  series?: Array<{
    data: (string | number)[];
    name?: string;
    type?: string;
  }>;
  pieData?: Array<{
    value: number;
    name: string;
  }>;
}

// ============ Daviz Component Props ============

export interface DavizProps {
  /** Database connection URI for LangChain SQL Agent */
  dbUri: DatabaseURI;

  /** LLM model name (e.g., "gemini-2.5-flash", "gpt-4") */
  model: string;

  /** API key for the LLM service */
  apiKey: string;

  /** Chart configuration */
  chartConfig: ChartConfig;

  /** Callback to handle user queries and execute via SQL Agent */
  onExecuteQuery: (query: string) => Promise<QueryResult>;

  /** Chart height in pixels */
  height?: number;

  /** Custom error handler */
  onError?: (error: Error) => void;

  /** Callback when data is loaded */
  onDataLoaded?: (data: any[]) => void;

  /** Optional className for styling */
  className?: string;
}

// ============ Query Execution Result ============

export interface QueryResult {
  success: boolean;
  data?: any[];
  chartConfig?: Partial<ChartConfig>;
  error?: string;
}
