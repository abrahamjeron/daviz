// src/utils/transformer/xyTransformer.ts
import { ChartConfig } from "./universalTransformer";

export function transformXYChart(rows: any[], config: ChartConfig) {
  return {
    xAxis: rows.map((r) => r[config.xField!]),
    series: [
      {
        id: "series1",
        label: config.yField!,
        data: rows.map((r) => Number(r[config.yField!])),
      },
    ],
  };
}
