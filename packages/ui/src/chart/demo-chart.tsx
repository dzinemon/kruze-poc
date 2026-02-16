"use client";

import { Bar, Pie, Line, Doughnut } from "react-chartjs-2";
import "./chart-config";
import { colorSchemes } from "./chart-config";

interface Dataset {
  label: string;
  values: number[];
}

interface DemoChartProps {
  chartType: "bar" | "pie" | "line" | "doughnut";
  title?: string;
  labels: string[];
  datasets: Dataset[];
  colorScheme?: keyof typeof colorSchemes;
  showLegend?: boolean;
  height?: number;
  sourceText?: string;
}

const chartComponents = { bar: Bar, pie: Pie, line: Line, doughnut: Doughnut };

export function DemoChart({
  chartType,
  title,
  labels,
  datasets,
  colorScheme = "brand",
  showLegend = true,
  height = 400,
  sourceText,
}: DemoChartProps) {
  const ChartComponent = chartComponents[chartType];
  const colors = colorSchemes[colorScheme];

  const data = {
    labels,
    datasets: datasets.map((ds, i) => ({
      label: ds.label,
      data: ds.values,
      backgroundColor:
        chartType === "line"
          ? colors[i % colors.length]
          : colors.slice(0, ds.values.length),
      borderColor:
        chartType === "line" ? colors[i % colors.length] : undefined,
      borderWidth: chartType === "line" ? 2 : 0,
      tension: 0.3,
    })),
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: showLegend },
      title: {
        display: !!title,
        text: title,
        font: { family: "Lato", size: 16, weight: "bold" as const },
      },
    },
    scales:
      chartType === "pie" || chartType === "doughnut"
        ? {}
        : {
            y: { beginAtZero: true, ticks: { font: { family: "Lato" } } },
            x: { ticks: { font: { family: "Lato" } } },
          },
  };

  return (
    <div className="w-full">
      <div style={{ height }}>
        <ChartComponent data={data} options={options} />
      </div>
      {sourceText && (
        <p className="mt-2 text-sm text-muted text-center italic">
          {sourceText}
        </p>
      )}
    </div>
  );
}
