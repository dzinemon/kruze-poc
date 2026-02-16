"use client";

import { DemoChart } from "./demo-chart";

interface ChartBlockProps {
  chartType: "bar" | "pie" | "line" | "doughnut";
  title?: string;
  labels: string[];
  datasets: { label: string; values: number[] }[];
  colorScheme?: "brand" | "warm" | "cool" | "mono";
  showLegend?: boolean;
  height?: number;
  sourceText?: string;
}

export function ChartBlockClient(props: ChartBlockProps) {
  return <DemoChart {...props} />;
}
