// app/components/SimpleChartView.tsx
"use client";

// Import charts from the package entrypoint. Make sure the package is installed.
import { BarChart, LineChart, PieChart } from "@mui/x-charts";

interface Props {
  chartType: string;
  data: any;
  height?: number;
}

export default function SimpleChartView({ chartType, data, height = 300 }: Props) {
  if (!data) return <p>Loading...</p>;

  switch (chartType) {
    case "bar":
      return <BarChart xAxis={[{ data: data.xAxis }]} series={data.series} height={height} />;

    case "line":
      return <LineChart xAxis={[{ data: data.xAxis }]} series={data.series} height={height} />;

    case "pie":
      return <PieChart series={[{ data: data.pieData }]} height={height} />;

    default:
      return <p>Unsupported chart type</p>;
  }
}
