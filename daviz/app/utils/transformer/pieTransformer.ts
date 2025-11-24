// src/utils/transformer/pieTransformer.ts
import { ChartConfig } from "./universalTransformer";

export function transformPieChart(rows: any[], config: ChartConfig) {
  return {
    pieData: rows.map((r, idx) => ({
      id: idx,
      value: Number(r[config.valueField!]),
      label: r[config.labelField!],
    })),
  };
}
