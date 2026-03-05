"use client";

import React, { useEffect, useRef, useState } from "react";
import { loadGoogleCharts } from "./google-charts-loader";

interface GoogleChartConfig {
  type: string;
  data: Array<Array<string | number>>;
  options?: Record<string, unknown>;
}

export interface GoogleChartProps {
  jsonConfig: string; // Raw JSON string: { type, data, options }
  title?: string;
  height?: number;
}

/**
 * GoogleChart component
 * Lazily loads Google Charts library and renders a chart from JSON config
 * Uses IntersectionObserver to defer script loading until chart is near viewport
 */
export function GoogleChart({
  jsonConfig,
  title,
  height = 400,
}: GoogleChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasLoaded && containerRef.current) {
          renderChart();
          setHasLoaded(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "-100px 0px",
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [jsonConfig, hasLoaded]);

  const renderChart = async () => {
    if (!containerRef.current) return;

    try {
      // Parse JSON config
      let config: GoogleChartConfig;
      try {
        config = JSON.parse(jsonConfig);
      } catch (e) {
        setError("Invalid JSON configuration");
        return;
      }

      // Validate required fields
      if (!config.type || !Array.isArray(config.data)) {
        setError("Chart config must have 'type' and 'data' array");
        return;
      }

      // Load Google Charts library
      const google = await loadGoogleCharts();

      // Create data table
      const dataTable = google.visualization.arrayToDataTable(config.data);

      // Get chart class from google.visualization
      const ChartClass = (
        google.visualization as Record<string, any>
      )[config.type];
      if (typeof ChartClass !== "function") {
        setError(`Unknown chart type: ${config.type}`);
        return;
      }

      // Instantiate and draw chart
      const chart = new ChartClass(containerRef.current);
      chart.draw(dataTable, config.options || {});
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to render chart";
      setError(errorMessage);
      console.error("GoogleChart render error:", err);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {title && <h3 className="text-xl font-bold text-text-primary">{title}</h3>}
      <div
        ref={containerRef}
        style={{
          width: "100%",
          height: `${height}px`,
        }}
        className="bg-bg-base"
      />
      {error && (
        <div className="rounded-sm bg-danger-light border border-danger/30 text-danger-dark px-4 py-3 text-sm">
          Chart error: {error}
        </div>
      )}
    </div>
  );
}
