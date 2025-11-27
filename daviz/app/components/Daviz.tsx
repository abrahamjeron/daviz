"use client";

import { useEffect, useState, useImperativeHandle, forwardRef, useRef } from "react";
import SimpleChartView from "./SimpleChartView";
import { transformData } from "../utils/transformer/universalTransformer";
import { sanitizeAgentResponse } from "../utils/sanitizeAgentResponse";
import { DavizProps, QueryResult } from "../types/daviz.types";
import { runQueryAction } from "../actions/runQuery";

export interface DavizRef {
  /**
   * Execute a natural language query via the SQL Agent
   * @param query Natural language question about the data
   */
  executeQuery: (query: string) => Promise<void>;
}

const Daviz = forwardRef<DavizRef, DavizProps>(
  (
    {
      dbUri, // passed to sql agent
      model, // passed to sql agent
      apiKey, // passed to sql agent
      height = 300,
      className,
    },
    ref
  ) => {

    // Render states
    const [chartData, setChartData] = useState<any>(null);
    const [agentChartConfig, setAgentChartConfig] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [query, setQuery] = useState("");
    const [response, setResponse] = useState<any>(null);
    const davizRef = useRef<DavizRef>(null);

    /**
     * Execute a query through the SQL Agent
     * This calls the runAgent function which handles:
     * 1. Sending the query to the langchain SQL Agent
     * 2. Getting back formatted data and chart configuration
     * 3. Transforming data for visualization
     */
    const executeQueryHandler = async (queryString: string) => {
      setLoading(true);
      setError(null);
      try {
        console.log("Executing query via SQL Agent:", queryString);
        
        // Call the server action to execute the query with all configuration
        const response = await runQueryAction(queryString, dbUri, model, apiKey);
        
        // Store raw response
        setResponse(response);
        
        // Sanitize the response to extract result and chartconfig
        const sanitized = sanitizeAgentResponse(response);

        // Extract result and chartconfig from sanitized response
        const { result, chartconfig } = sanitized;

        console.log("Agent returned chartconfig:", chartconfig);
        console.log("Agent returned result:", result);

        // Store the agent's chartconfig
        setAgentChartConfig(chartconfig);

        // Transform data for charting using the agent's chartconfig
        const transformed = transformData(result, chartconfig);
        setChartData(transformed);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
        setError(errorMessage);
        console.error("Query execution error:", errorMessage);
      } finally {
        setLoading(false);
      }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (query.trim()) {
        await executeQueryHandler(query);
      }
    };

    useImperativeHandle(ref, () => ({
      executeQuery: executeQueryHandler,
    }));

    return (
      <div className={className}>
        {/* Query Input Form */}
        <form onSubmit={handleSubmit} className="mb-6 space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter your natural language query..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Loading..." : "Submit"}
            </button>
          </div>
        </form>

        {/* Status Messages */}
        {loading && <div className="text-center text-gray-500 mb-4">Loading...</div>}
        {error && <div className="text-center text-red-500 mb-4 p-3 bg-red-50 rounded-lg">Error: {error}</div>}

        {/* Chart Display */}
        {!loading && !error && chartData && agentChartConfig && (
          <div className="mb-6">
            <SimpleChartView
              chartType={agentChartConfig.chartType}
              data={chartData}
              height={height}
            />
          </div>
        )}
      </div>
    );
  }
);

Daviz.displayName = "Daviz";

export default Daviz;
