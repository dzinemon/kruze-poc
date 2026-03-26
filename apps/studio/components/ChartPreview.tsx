import { useEffect, useRef, useCallback } from "react";
import { useFormValue } from "sanity";
import { Card, Text, Stack } from "@sanity/ui";
import { buildChartJsonConfig } from "@kruze-poc/ui/chart";
import type { ChartDocumentData } from "@kruze-poc/ui/chart";

/**
 * Live chart preview pane for the Sanity Studio chart document editor.
 * Loads Google Charts and renders the chart using the current document fields.
 */

type GoogleType = {
  charts: {
    load: (version: string, options: { packages: string[] }) => void;
    setOnLoadCallback: (callback: () => void) => void;
  };
  visualization: Record<string, any>;
};

declare global {
  interface Window {
    google?: GoogleType;
  }
}

let googlePromise: Promise<GoogleType> | null = null;

function loadGoogle(): Promise<GoogleType> {
  if (googlePromise) return googlePromise;
  googlePromise = new Promise((resolve, reject) => {
    if (typeof window !== "undefined" && window.google?.charts) {
      resolve(window.google);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://www.gstatic.com/charts/loader.js";
    script.onload = () => {
      if (!window.google) {
        reject(new Error("Failed to load Google Charts"));
        return;
      }
      window.google.charts.load("current", {
        packages: ["corechart", "bar", "table"],
      });
      window.google.charts.setOnLoadCallback(() => {
        if (window.google) resolve(window.google);
      });
    };
    script.onerror = () => reject(new Error("Script load failed"));
    document.head.appendChild(script);
  });
  return googlePromise;
}

export function ChartPreview() {
  const chartRef = useRef<HTMLDivElement>(null);

  const title = useFormValue(["title"]) as string | undefined;
  const chartType = useFormValue(["chartType"]) as string | undefined;
  const data = useFormValue(["data"]) as string | undefined;
  const colors = useFormValue(["colors"]) as string[] | undefined;
  const seriesType = useFormValue(["seriesType"]) as string | undefined;
  const isStacked = useFormValue(["isStacked"]) as boolean | undefined;
  const vAxisTitle = useFormValue(["vAxisTitle"]) as string | undefined;
  const hAxisTitle = useFormValue(["hAxisTitle"]) as string | undefined;
  const vAxisFormat = useFormValue(["vAxisFormat"]) as string | undefined;
  const hAxisFormat = useFormValue(["hAxisFormat"]) as string | undefined;
  const legendPosition = useFormValue(["legendPosition"]) as string | undefined;
  const numberFormat = useFormValue(["numberFormat"]) as
    | { prefix?: string; suffix?: string; pattern?: string }
    | undefined;
  const aspectRatio = useFormValue(["aspectRatio"]) as string | undefined;
  const advancedOptions = useFormValue(["advancedOptions"]) as
    | string
    | undefined;

  const drawChart = useCallback(async () => {
    if (!chartRef.current || !chartType || !data) return;

    try {
      const doc: ChartDocumentData = {
        _id: "",
        title: title ?? "",
        chartType,
        data,
        colors,
        seriesType,
        isStacked,
        vAxisTitle,
        hAxisTitle,
        vAxisFormat,
        hAxisFormat,
        legendPosition,
        numberFormat,
        aspectRatio,
        advancedOptions,
      };

      const jsonConfig = buildChartJsonConfig(doc);
      const config = JSON.parse(jsonConfig);

      // Handle validation errors from buildChartJsonConfig
      if (config.error || !Array.isArray(config.data)) {
        if (chartRef.current) {
          chartRef.current.innerHTML = `<p style="color: #666; padding: 16px;">${config.error || "Waiting for valid chart data…"}</p>`;
        }
        return;
      }

      const google = await loadGoogle();
      const dataTable = google.visualization.arrayToDataTable(config.data);

      const ChartClass = google.visualization[config.type];
      if (typeof ChartClass !== "function") return;

      const options = {
        backgroundColor: "transparent",
        colors: [
          "#2C5B7A",
          "#D47440",
          "#32662C",
          "#4697CA",
          "#8F338A",
          "#62A040",
        ],
        legend: { position: "bottom", maxLines: 3 },
        animation: { startup: true, duration: 800, easing: "out" },
        chartArea: { top: 40, right: 0, bottom: 60, left: 60 },
        ...config.options,
      };

      // Apply number formatting
      const nf = options.numberFormat as
        | { prefix?: string; suffix?: string; pattern?: string }
        | undefined;
      if (nf && (nf.prefix || nf.suffix || nf.pattern)) {
        const formatter = new google.visualization.NumberFormat({
          prefix: nf.prefix ?? "",
          suffix: nf.suffix ?? "",
          pattern: nf.pattern,
        });
        for (let col = 0; col < dataTable.getNumberOfColumns(); col++) {
          if (dataTable.getColumnType(col) === "number") {
            formatter.format(dataTable, col);
          }
        }
        delete options.numberFormat;
      }

      const chart = new ChartClass(chartRef.current);
      chart.draw(dataTable, options);
    } catch (err) {
      if (chartRef.current) {
        chartRef.current.innerHTML = `<p style="color: red; padding: 16px;">Preview error: ${err instanceof Error ? err.message : "Unknown error"}</p>`;
      }
    }
  }, [
    title,
    chartType,
    data,
    colors,
    seriesType,
    isStacked,
    vAxisTitle,
    hAxisTitle,
    vAxisFormat,
    hAxisFormat,
    legendPosition,
    numberFormat,
    aspectRatio,
    advancedOptions,
  ]);

  useEffect(() => {
    const timeout = setTimeout(drawChart, 300);
    return () => clearTimeout(timeout);
  }, [drawChart]);

  if (!chartType || !data) {
    return (
      <Card padding={5}>
        <Stack space={3}>
          <Text size={2} muted>
            Fill in the Chart Type and Data Table fields to see a preview.
          </Text>
        </Stack>
      </Card>
    );
  }

  return (
    <Card padding={4}>
      <Stack space={3}>
        {title && (
          <Text size={2} weight="bold">
            {title}
          </Text>
        )}
        <div
          ref={chartRef}
          style={{
            width: "100%",
            aspectRatio: aspectRatio || "4/3",
            minHeight: 300,
          }}
        />
      </Stack>
    </Card>
  );
}
