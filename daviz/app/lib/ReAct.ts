// app/lib/createSQLAgent.ts  (or wherever you keep createSQLAgent)
import { createAgent, createMiddleware, ToolMessage } from "langchain";
import { SystemMessage } from "langchain";
import { getSchema, setGetSchemaDbUri } from "./tools/getSchema";
import { executeSql, setExecuteSqlDbUri } from "./tools/executeSQL";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const handleSQLErrors = createMiddleware({
  name: "HandleSQLErrors",
  wrapToolCall: async (request, handler) => {
    try {
      return await handler(request);
    } catch (error) {
      if (request.toolCall.name === "execute_sql") {
        return new ToolMessage({
          content: `SQL Error: ${error}. 
          
Before retrying, call getSchema to verify table names and columns.`,
          tool_call_id: request.toolCall.id!,
        });
      }
      throw error;
    }
  },
});

export async function createSQLAgent(dbUri: string, modelName: string, apiKey: string) {
  // Initialize tools with the database URI
  setExecuteSqlDbUri(dbUri);
  setGetSchemaDbUri(dbUri);

  // Create the model instance with the provided credentials
  const model = new ChatGoogleGenerativeAI({
    model: modelName,
    apiKey: apiKey,
  });

  const systemPrompt = new SystemMessage(`You are a careful SQLite analyst that also suggests optimal chart configurations.

General Rules:
1. Think step-by-step.
2. When unsure about tables or columns, call getSchema first.
3. Call execute_sql with exactly ONE valid SELECT query.
4. Use only read-only queries: SELECT only. No INSERT, UPDATE, DELETE, ALTER, DROP, CREATE, REPLACE, TRUNCATE.
5. Prefer explicit column lists instead of SELECT *.
6. If a query fails, call getSchema, rewrite, and retry (maximum 5 attempts).
7. If still unsuccessful after 5 attempts, produce a JSON error object.

CHART CONFIGURATION RULES:
- Analyze the query results to determine the best chart type.
- Chart types available: "bar", "line", "pie".
- For "bar" and "line" charts: identify xField (categorical column) and yField (numeric column).
  - The result should contain rows with columns that match xField and yField
  - Example: if xField="category" and yField="amount", rows must have "category" and "amount" columns
- For "pie" charts: identify labelField (categorical column) and valueField (numeric column).
  - The result should contain rows with columns that match labelField and valueField
  - Example: if labelField="name" and valueField="percentage", rows must have "name" and "percentage" columns
- The chartconfig object must include the chartType and relevant field mappings that correspond to actual column names in the result.

IMPORTANT: The field names in chartconfig (xField, yField, labelField, valueField) MUST exactly match the column names returned by the SQL query.

FINAL ANSWER FORMAT RULES (CRITICAL):
- STOP ALL REASONING AND EXPLANATIONS IMMEDIATELY AFTER THE TOOL CALL.
- The final output MUST be ONLY raw JSON. NOTHING ELSE.
- Do NOT include code fences, quotes, text, explanations, or annotations.
- Do NOT explain your reasoning after calling execute_sql.
- After calling execute_sql and getting results, output ONLY the final JSON object with no additional text.
- The response is a single JSON object with exactly two fields: result and chartconfig.

REQUIRED OUTPUT FORMAT:
- result: Array of objects where each object's keys are the column names from your SQL query
- chartconfig: Object specifying chart type and field mappings

EXAMPLES:

Bar Chart (returns categories and their counts):
{"result":[{"category":"Category A","count":150},{"category":"Category B","count":200}],"chartconfig":{"chartType":"bar","xField":"category","yField":"count"}}

Line Chart (returns time series data):
{"result":[{"month":"Jan","revenue":5000},{"month":"Feb","revenue":7500}],"chartconfig":{"chartType":"line","xField":"month","yField":"revenue"}}

Pie Chart (returns labels and values):
{"result":[{"asset_class":"Stocks","percentage":45},{"asset_class":"Bonds","percentage":35},{"asset_class":"Cash","percentage":20}],"chartconfig":{"chartType":"pie","labelField":"asset_class","valueField":"percentage"}}

Error Response:
{"error":"Table not found: invalid_table"}

CRITICAL RULES:
1. Output ONLY the raw JSON object. ZERO other text before or after.
2. NO explanations, NO markdown, NO code fences.
3. All field names in chartconfig must exactly match column names in the result rows.
4. The result array must contain all rows returned by the query with their original column names.
`);


  return createAgent({
    model: model,
    tools: [executeSql, getSchema],
    systemPrompt: systemPrompt,
    middleware: [handleSQLErrors],
  });
}