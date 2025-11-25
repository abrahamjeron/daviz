import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

export const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  apiKey: "AIzaSyCcp2-411ZXvQUpV31m4dXov0LQoVgQ2C0"
});