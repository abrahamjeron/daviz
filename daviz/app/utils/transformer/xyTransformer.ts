// src/utils/transformer/xyTransformer.ts
import { ChartConfig } from "./universalTransformer";

export function transformXYChart(rows: any[], config: ChartConfig) {
  // Convert y values to numbers, filtering out NaN values
  const numericData = rows.map((r) => {
    const value = r[config.yField!];
    const num = Number(value);
    // If conversion results in NaN, try to parse as integer
    if (isNaN(num)) {
      console.warn(`Could not convert "${value}" to number for field "${config.yField}"`);
      return 0; // Default to 0 for invalid values
    }
    return num;
  });

  return {
    xAxis: rows.map((r) => r[config.xField!]),
    series: [
      {
        id: "series1",
        label: config.yField!,
        data: numericData,
      },
    ],
  };
}
