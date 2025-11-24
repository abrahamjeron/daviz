// src/components/AIViz.tsx
"use client";

import { useEffect, useState } from "react";
import SimpleChartView from "./SimpleChartView";
import { transformData, ChartConfig } from "../utils/transformer/universalTransformer";

interface Props {
  query: string;
  chartConfig: ChartConfig;
  fetcher: (query: string) => Promise<any[]>;
  height?: number;
}

export default function AIViz({ query, chartConfig, fetcher, height = 300 }: Props) {
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    async function load() {
      const rows = await fetcher(query);
      const transformed = transformData(rows, chartConfig);
      setChartData(transformed);
    }
    load();
  }, [query]);

  return <SimpleChartView chartType={chartConfig.chartType} data={chartData} height={height} />;
}
