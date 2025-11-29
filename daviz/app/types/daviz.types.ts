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

// ============ Chat Message Interface ============

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  chartData?: any;
  chartConfig?: any;
  error?: string;
}

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
  /** Database connection URI or file path for LangChain SQL Agent
   * Examples:
   * - PostgreSQL: postgresql://user:password@localhost:5432/dbname
   * - SQLite: sqlite:///path/to/database.db
   * - MySQL: mysql+pymysql://user:password@localhost:3306/dbname
   */
  dbUri: DatabaseURI;

  /** LLM model name (e.g., "gemini-2.5-flash", "gpt-4", "claude-3-sonnet") */
  model: string;

  /** API key for the LLM service */
  apiKey: string;

  /** Chart height in pixels (default: 300) */
  height?: number;

  /** Optional className for styling */
  className?: string;

  /** Callback to handle user queries and execute via SQL Agent (optional for demo) */
  onExecuteQuery?: (query: string) => Promise<QueryResult>;

  /** Custom error handler */
  onError?: (error: Error) => void;

  /** Callback when data is loaded */
  onDataLoaded?: (data: any[]) => void;

  /** Callback when a message is sent */
  onMessageSent?: (message: ChatMessage) => void;

  /** Callback when a message is received */
  onMessageReceived?: (message: ChatMessage) => void;
}

// ============ Conversation Panel Props ============

export interface ConversationPanelProps {
  messages: ChatMessage[];
  onSendMessage: (query: string) => void;
  loading: boolean;
  className?: string;
}

// ============ Chart Display Panel Props ============

export interface ChartDisplayPanelProps {
  chartData: any;
  chartConfig: any;
  height: number;
  className?: string;
}

// ============ Query Execution Result ============

export interface QueryResult {
  success: boolean;
  data?: any[];
  chartConfig?: Partial<ChartConfig>;
  error?: string;
}
