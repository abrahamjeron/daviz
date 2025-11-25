// app/lib/ReAct.ts
import { createSQLAgent } from "./ReAct"

export async function runAgent() {
  const agent = await createSQLAgent();  // Await the agent creation
  
  const question = "How many users data is in the database?";
  const stream = await agent.stream(
    { messages: [{ role: "user", content: question }] },
    { streamMode: "values" }
  );

  for await (const step of stream) {
    const message = step.messages.at(-1);
    
    if (message) {
      const role = message.constructor.name;
      console.log(`${role}: ${JSON.stringify(message.content, null, 2)}`);
    }
  }
}

runAgent();