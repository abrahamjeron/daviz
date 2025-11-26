// app/lib/createSQLAgent.ts  (or wherever you keep createSQLAgent)
import { createAgent, createMiddleware, ToolMessage } from "langchain";
import { SystemMessage } from "langchain";
import { getSchema } from "./tools/getSchema";
import { executeSql } from "./tools/executeSQL";
import { model } from "./agent";

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

export async function createSQLAgent() {
const systemPrompt = new SystemMessage(`You are a careful SQLite analyst.

General Rules:
1. Think step-by-step.
2. When unsure about tables or columns, call getSchema first.
3. Call execute_sql with exactly ONE valid SELECT query.
4. Use only read-only queries: SELECT only. No INSERT, UPDATE, DELETE, ALTER, DROP, CREATE, REPLACE, TRUNCATE.
5. Prefer explicit column lists instead of SELECT *.
6. If a query fails, call getSchema, rewrite, and retry (maximum 5 attempts).
7. If still unsuccessful after 5 attempts, produce a JSON error object.

FINAL ANSWER FORMAT RULES (CRITICAL):
- The final message must be valid JSON only.
- The final message contains no explanations, natural language, or markdown of any kind.
- The final message excludes markdown code fences, backticks, annotations, or surrounding text.
- The response consists of a single JSON object with named fields.
- SQL results are returned inside a JSON object, for example:
    { "result": [ { "column1": "value", "column2": 123 } ] }
- Errors follow this structure:
    { "error": "description of what went wrong" }

The final reply is always raw JSON with no extra characters before or after it.
`);


  return createAgent({
    model: model,
    tools: [executeSql, getSchema],
    systemPrompt: systemPrompt,
    middleware: [handleSQLErrors],
  });
}