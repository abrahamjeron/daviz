"use server";

import { createSQLAgent } from "../lib/ReAct";
import { HumanMessage } from "langchain";

export async function runQueryAction(
  userQuery: string,
  dbUri: string,
  model: string,
  apiKey: string
) {
  try {
    const agent = await createSQLAgent(dbUri, model, apiKey);
    
    const stream = await agent.stream(
      { messages: [new HumanMessage(userQuery)] },
      { streamMode: "values" }
    );

    let finalResult = null;
    for await (const step of stream) {
      const message = step.messages.at(-1);
      
      if (message) {
        const role = message.constructor.name;
        console.log(`${role}: ${JSON.stringify(message.content, null, 2)}`);
        
        // Extract text content from the message
        // message.content can be a string or an array of content blocks
        if (typeof message.content === "string") {
          finalResult = message.content;
        } else if (Array.isArray(message.content)) {
          // Look for text blocks in the content array
          const textBlocks = message.content
            .filter((block: any) => typeof block === "string" || (block.type === "text" && block.text))
            .map((block: any) => typeof block === "string" ? block : block.text)
            .join("");
          
          if (textBlocks) {
            finalResult = textBlocks;
          }
        }
      }
    }
    
    return finalResult ? JSON.stringify(finalResult, null, 2) : "{}";
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Query execution error:", errorMessage);
    throw error;
  }
}
