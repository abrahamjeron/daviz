// src/utils/transformer/pieTransformer.ts
import { ChartConfig } from "./universalTransformer";

export function transformPieChart(rows: any[], config: ChartConfig) {
  return {
    pieData: rows
      .map((r, idx) => {
        const value = Number(r[config.valueField!]);
        // Filter out invalid values
        if (isNaN(value)) {
          console.warn(`Could not convert "${r[config.valueField!]}" to number for field "${config.valueField}"`);
          return null;
        }
        return {
          id: idx,
          value: value,
          label: r[config.labelField!],
        };
      })
      .filter((item) => item !== null), // Remove null entries
  };
}
