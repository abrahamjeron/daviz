"use client";

import { useEffect, useState, useImperativeHandle, forwardRef } from "react";
import SimpleChartView from "./SimpleChartView";
import { transformData } from "../utils/transformer/universalTransformer";
import { DavizProps, QueryResult } from "../types/daviz.types";

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
      chartConfig,
      height = 300,
      className,
    },
    ref
  ) => {

    /**
     * Execute a query through the SQL Agent
     * This calls the onExecuteQuery callback which handles:
     * 1. Sending the query to the langchain SQL Agent
     * 2. Getting back formatted data and chart configuration
     * 3. Transforming data for visualization
     */
    // Render states
    const [chartData, setChartData] = useState<any>(null);
    useImperativeHandle(ref, () => ({
      async executeQuery(query: string) {
        // For demonstration, we simulate a query execution
        // In production, this would call onExecuteQuery(query)
        console.log("Executing query via SQL Agent:", query);
        // Simulated response data
        const simulatedData = [
          { category: "A", value: 30 },
          { category: "B", value: 70 },
        ];

        // Transform data for charting
        const transformed = transformData(simulatedData, chartConfig);
        setChartData(transformed);
      },
    }));

    return (
      <div className={className}>
        <SimpleChartView
          chartType={chartConfig.chartType}
          data={chartData}
          height={height}
        />
      </div>
    );
  }
);

Daviz.displayName = "Daviz";

export default Daviz;
