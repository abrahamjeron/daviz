/**
 * Sanitizes the AI Agent response which may contain multiple text chunks
 * and extracts the valid JSON object containing result and chartconfig
 */
export function sanitizeAgentResponse(response: any): {
  result: any[];
  chartconfig: {
    chartType: "bar" | "line" | "pie";
    xField?: string;
    yField?: string;
    labelField?: string;
    valueField?: string;
  };
} {
  let jsonString = "";

  // If response is an array (from streaming), look for the JSON object
  if (Array.isArray(response)) {
    for (const item of response) {
      if (typeof item === "object" && item.type === "text" && item.text) {
        // Try to find JSON in the text
        const jsonMatch = item.text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          jsonString = jsonMatch[0];
          break;
        }
      } else if (typeof item === "string") {
        // Try to find JSON in string items
        const jsonMatch = item.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          jsonString = jsonMatch[0];
          break;
        }
      }
    }
  } else if (typeof response === "string") {
    // Clean the response: trim whitespace including newlines
    let cleaned = response.trim();
    
    // If the string starts and ends with quotes, it's a JSON-encoded string
    // Try to parse it first to extract the actual content
    if (cleaned.startsWith('"') && cleaned.endsWith('"')) {
      try {
        cleaned = JSON.parse(cleaned);
      } catch {
        // If parsing fails, continue with the original cleaned string
      }
    }
    
    // Trim again after potential unquoting
    if (typeof cleaned === "string") {
      cleaned = cleaned.trim();
    }
    
    // Try to extract JSON object from the string
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonString = jsonMatch[0].trim();
    } else {
      jsonString = cleaned;
    }
  } else if (typeof response === "object") {
    // If it's already an object, check if it has result and chartconfig
    if (response.result !== undefined || response.chartconfig || response.error) {
      return response;
    }
    jsonString = JSON.stringify(response);
  }

  if (!jsonString) {
    throw new Error("Could not extract JSON from agent response");
  }

  try {
    // Parse the JSON string
    const parsed = JSON.parse(jsonString);
    
    // If there's an error field, throw it
    if (parsed.error) {
      throw new Error(parsed.error);
    }
    
    if (!parsed.result || !parsed.chartconfig) {
      throw new Error("Response missing 'result' or 'chartconfig' field");
    }
    return parsed;
  } catch (err) {
    throw new Error(`Failed to parse agent response: ${err instanceof Error ? err.message : String(err)}`);
  }
}
