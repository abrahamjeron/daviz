// app/lib/SQL-Agent.ts
// Standalone test file for running SQL Agent locally
import { createSQLAgent } from "./ReAct"
import { HumanMessage } from "langchain"

export async function runAgent(
  UserQuery: string,
  dbUri: string,
  model: string,
  apiKey: string
) {
  const agent = await createSQLAgent(dbUri, model, apiKey);
  
  const stream = await agent.stream(
    { messages: [new HumanMessage(UserQuery)] },
    { streamMode: "values" }
  );

  let finalResult = null;
  for await (const step of stream) {
    const message = step.messages.at(-1);
    
    if (message) {
      const role = message.constructor.name;
      console.log(`${role}: ${JSON.stringify(message.content, null, 2)}`);
      finalResult = message.content;
    }
  }
  
  return JSON.stringify(finalResult, null, 2);
}

// Only run if this is the main module
if (require.main === module) {
  const dbUri = process.env.DB_URI || "sqlite:///path/to/database.db";
  const model = process.env.LLM_MODEL || "gemini-2.5-flash";
  const apiKey = process.env.LLM_API_KEY || "";

  runAgent(
    "Give me a pie chart showing the distribution percentage of 'preferred_asset_class' from the 'risk_profile' table.",
    dbUri,
    model,
    apiKey
  );
}
