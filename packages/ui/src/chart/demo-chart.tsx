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

function stripStega(str: string): string {
  return str.replace(/[\u200b-\u200f\u2028-\u202f\ufeff]/g, "");
}

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
  const cleanType = stripStega(chartType) as keyof typeof chartComponents;
  const cleanScheme = stripStega(colorScheme) as keyof typeof colorSchemes;
  const ChartComponent = chartComponents[cleanType];
  const colors = colorSchemes[cleanScheme] ?? colorSchemes.brand;

  if (!ChartComponent || !datasets?.length) {
    return null;
  }

  const data = {
    labels: labels ?? [],
    datasets: datasets.map((ds, i) => ({
      label: ds.label,
      data: ds.values ?? [],
      backgroundColor:
        cleanType === "line"
          ? colors[i % colors.length]
          : colors.slice(0, (ds.values ?? []).length),
      borderColor:
        cleanType === "line" ? colors[i % colors.length] : undefined,
      borderWidth: cleanType === "line" ? 2 : 0,
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
      cleanType === "pie" || cleanType === "doughnut"
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
