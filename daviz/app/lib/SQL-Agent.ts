// app/lib/ReAct.ts
import { createSQLAgent } from "./ReAct"
import { HumanMessage } from "langchain"

export async function runAgent(UserQuery: string = "Return all the data from all the table.") {
  const agent = await createSQLAgent();  // Await the agent creation
  
  const stream = await agent.stream(
    { messages: [new HumanMessage(UserQuery)] },
    { streamMode: "values" }
  );

  for await (const step of stream) {
    const message = step.messages.at(-1);
    
    if (message) {
      const role = message.constructor.name;
      // console.log(`${role}: ${JSON.stringify(message.content, null, 2)}`);
      return JSON.stringify(message.content, null, 2);
    }
  }
}

runAgent();