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
  aspectRatio?: string; // e.g. "4/3", "16/9", "1/1" — defaults to "4/3"
}

/**
 * Default chart options matching production patterns
 * Applied as base layer before CMS overrides
 */
function getDefaultOptions(isMobile: boolean) {
  return {
    backgroundColor: "transparent",
    lineWidth: isMobile ? 3 : 4,
    colors: [
      "#2C5B7A",
      "#D47440",
      "#32662C",
      "#4697CA",
      "#8F338A",
      "#62A040",
      "#4285f4",
      "#ff6565",
      "#E8A838",
      "#3A9E8F",
    ],
    legend: {
      position: "bottom",
      alignment: "center",
      maxLines: 3,
      textStyle: { fontSize: isMobile ? 13 : 14 },
    },
    animation: {
      startup: true,
      duration: 1000,
      easing: "out",
    },
    vAxis: {
      textStyle: {
        fontSize: isMobile ? 12 : 14,
        color: "#024D7C",
        bold: true,
      },
      gridlines: { color: "#E9E9E9" },
      titleTextStyle: { fontSize: isMobile ? 12 : 14, bold: true },
    },
    hAxis: {
      viewWindowMode: "pretty",
      textStyle: {
        fontSize: isMobile ? 12 : 14,
        color: "#434344",
        bold: true,
      },
      gridlines: { color: "#E9E9E9" },
      format: "####",
    },
    chartArea: {
      backgroundColor: "transparent",
      top: isMobile ? 20 : 40,
      right: 0,
      bottom: isMobile ? 60 : 80,
      left: isMobile ? 40 : 60,
    },
  };
}

/**
 * GoogleChart component
 * Lazily loads Google Charts library and renders a chart from JSON config
 * Uses IntersectionObserver to defer script loading until chart is near viewport
 * Applies default options (brand colors, animations, responsive sizing) with CMS override layer
 * Responsive aspect ratio (default 4:3) scales with container width
 */
export function GoogleChart({
  jsonConfig,
  title,
  aspectRatio = "4/3",
}: GoogleChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lastIsMobileRef = useRef<boolean | null>(null);
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

  // Re-render chart on window resize if isMobile breakpoint changes
  useEffect(() => {
    const handleResize = () => {
      const nowMobile = window.innerWidth < 768;
      if (
        hasLoaded &&
        lastIsMobileRef.current !== null &&
        nowMobile !== lastIsMobileRef.current
      ) {
        renderChart();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [hasLoaded]);

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

      // Determine responsive breakpoint
      const isMobile = window.innerWidth < 768;
      lastIsMobileRef.current = isMobile;

      // Deep merge: defaults + CMS overrides
      const cmsOptions = (config.options ?? {}) as Record<string, any>;
      const defaults = getDefaultOptions(isMobile);

      const mergedOptions = {
        ...defaults,
        ...cmsOptions,
        // colors: CMS completely replaces defaults (not merged)
        colors: cmsOptions.colors ?? defaults.colors,
        // Nested objects: one level deep merge
        legend: {
          ...defaults.legend,
          ...(cmsOptions.legend ?? {}),
          textStyle: {
            ...defaults.legend.textStyle,
            ...(cmsOptions.legend?.textStyle ?? {}),
          },
        },
        animation: {
          ...defaults.animation,
          ...(cmsOptions.animation ?? {}),
        },
        vAxis: {
          ...defaults.vAxis,
          ...(cmsOptions.vAxis ?? {}),
          textStyle: {
            ...defaults.vAxis.textStyle,
            ...(cmsOptions.vAxis?.textStyle ?? {}),
          },
          gridlines: {
            ...defaults.vAxis.gridlines,
            ...(cmsOptions.vAxis?.gridlines ?? {}),
          },
          titleTextStyle: {
            ...defaults.vAxis.titleTextStyle,
            ...(cmsOptions.vAxis?.titleTextStyle ?? {}),
          },
        },
        hAxis: {
          ...defaults.hAxis,
          ...(cmsOptions.hAxis ?? {}),
          textStyle: {
            ...defaults.hAxis.textStyle,
            ...(cmsOptions.hAxis?.textStyle ?? {}),
          },
          gridlines: {
            ...defaults.hAxis.gridlines,
            ...(cmsOptions.hAxis?.gridlines ?? {}),
          },
        },
        chartArea: {
          ...defaults.chartArea,
          ...(cmsOptions.chartArea ?? {}),
        },
      };

      // Instantiate and draw chart
      const chart = new ChartClass(containerRef.current);
      chart.draw(dataTable, mergedOptions);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to render chart";
      setError(errorMessage);
      console.error("GoogleChart render error:", err);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <style>{`
        .wm-kruze {
          position: relative;
        }
        .wm-kruze::before {
          content: "";
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          background-image: url(/img/wm/logo-kruze.png);
          background-repeat: no-repeat;
          background-size: 120px;
          background-position: center;
          opacity: 0;
          pointer-events: none;
        }
        @media (min-width: 768px) {
          .wm-kruze::before {
            background-size: 196px;
          }
        }
        .wm-kruze.chart-loaded::before {
          transition: opacity 500ms 750ms ease-in;
          opacity: 0.15;
        }
      `}</style>
      {title && <h3 className="text-xl font-bold text-primary">{title}</h3>}
      <div
        ref={containerRef}
        style={{
          width: "100%",
          aspectRatio,
        }}
        className={`bg-bg-base wm-kruze${hasLoaded ? " chart-loaded" : ""}`}
      />
      {error && (
        <div className="rounded-sm bg-danger-light border border-danger/30 text-danger-dark px-4 py-3 text-sm">
          Chart error: {error}
        </div>
      )}
    </div>
  );
}
