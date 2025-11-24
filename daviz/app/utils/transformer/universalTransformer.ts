// src/utils/transformer/universalTransformer.ts
import { transformXYChart } from "./xyTransformer";
import { transformPieChart } from "./pieTransformer";

export interface ChartConfig {
  chartType: "line" | "bar" | "area" | "pie";
  xField?: string;
  yField?: string;
  labelField?: string;
  valueField?: string;
}

export function transformData(rows: any[], chartConfig: ChartConfig) {
  switch (chartConfig.chartType) {
    case "line":
    case "bar":
    case "area":
      return transformXYChart(rows, chartConfig);
    case "pie":
      return transformPieChart(rows, chartConfig);
    default:
      throw new Error(`Unsupported chart type: ${chartConfig.chartType}`);
  }
}
