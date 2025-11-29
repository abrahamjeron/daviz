"use client";

import { useState, useImperativeHandle, forwardRef } from "react";
import ConversationPanel from "./ConversationPanel";
import ChartDisplayPanel from "./ChartDisplayPanel";
import { transformData } from "../utils/transformer/universalTransformer";
import { sanitizeAgentResponse } from "../utils/sanitizeAgentResponse";
import { DavizProps, ChatMessage } from "../types/daviz.types";
import { runQueryAction } from "../actions/runQuery";

export interface DavizRef {
  executeQuery: (query: string) => Promise<void>;
}

const Daviz = forwardRef<DavizRef, DavizProps>(
  (
    {
      dbUri,
      model,
      apiKey,
      height = 500, // Increased default height for better visual
      className,
      onMessageSent,
      onMessageReceived,
    },
    ref
  ) => {
    // Chat state
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [loading, setLoading] = useState(false);
    
    // Chart display state
    const [currentChartData, setCurrentChartData] = useState<any>(null);
    const [currentChartConfig, setCurrentChartConfig] = useState<any>(null);

    const generateMessageId = () => `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const handleSendMessage = async (queryString: string) => {
      const userMessage: ChatMessage = {
        id: generateMessageId(),
        role: "user",
        content: queryString,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, userMessage]);
      setLoading(true);

      if (onMessageSent) onMessageSent(userMessage);

      try {
        const response = await runQueryAction(queryString, dbUri, model, apiKey);
        const { result, chartconfig } = sanitizeAgentResponse(response);
        const transformed = transformData(result, chartconfig);
        
        setCurrentChartData(transformed);
        setCurrentChartConfig(chartconfig);

        const assistantMessage: ChatMessage = {
          id: generateMessageId(),
          role: "assistant",
          content: result && result.length > 0 
            ? `I've visualized the data based on your query. found ${result.length} records.`
            : "Query executed successfully.",
          timestamp: new Date(),
          chartData: transformed,
          chartConfig: chartconfig,
        };

        setMessages((prev) => [...prev, assistantMessage]);
        if (onMessageReceived) onMessageReceived(assistantMessage);

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
        const errorMsg: ChatMessage = {
          id: generateMessageId(),
          role: "assistant",
          content: "I encountered an issue processing that query.",
          error: errorMessage,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMsg]);
      } finally {
        setLoading(false);
      }
    };

    const executeQueryHandler = async (queryString: string) => {
      await handleSendMessage(queryString);
    };

    useImperativeHandle(ref, () => ({
      executeQuery: executeQueryHandler,
    }));

    return (
      <div 
        className={`
          relative w-full  mx-auto 
          flex flex-col lg:flex-row gap-8 
          ${className}
        `}
        style={{ 
          height: '100vh', // Account for padding
          padding: '32px' // Explicit padding in pixels
        }}
      >
        {/* Chart Display Panel - 60% */}
        <div className="flex-[300] h-full min-h-0">
          <ChartDisplayPanel
            chartData={currentChartData}
            chartConfig={currentChartConfig}
            height={height}
          />
        </div>

        {/* Conversation Panel - 40% */}
        <div className="flex-[150] h-full min-h-0">
          <ConversationPanel
            messages={messages}
            onSendMessage={handleSendMessage}
            loading={loading}
          />
        </div>
      </div>
    );
  }
);

Daviz.displayName = "Daviz";

export default Daviz;