/**
 * Input shape for buildChartJsonConfig — what the function needs.
 * Keep in sync with ChartDocument in @kruze-poc/sanity-schemas/src/types/index.ts
 */
export interface ChartDocumentData {
  _id: string;
  title: string;
  chartType: string;
  data: string;
  colors?: string[];
  seriesType?: string;
  isStacked?: boolean;
  vAxisTitle?: string;
  hAxisTitle?: string;
  vAxisFormat?: string;
  hAxisFormat?: string;
  legendPosition?: string;
  numberFormat?: { prefix?: string; suffix?: string; pattern?: string };
  aspectRatio?: string;
  advancedOptions?: string;
}

/**
 * Converts a structured ChartDocument into the jsonConfig string
 * that GoogleChart expects: { type, data, options }
 *
 * This bridges the structured Sanity fields → the existing renderer
 * with zero changes to GoogleChart itself.
 */
export function buildChartJsonConfig(chart: ChartDocumentData): string {
  // Parse the data table JSON array
  let data: Array<Array<string | number>>;
  try {
    if (!chart.data) {
      return JSON.stringify({
        type: chart.chartType || "LineChart",
        data: null,
        error: "No chart data provided",
      });
    }
    data = JSON.parse(chart.data);
    // Google Charts requires at least 2 columns (label + value)
    if (!Array.isArray(data) || data.length < 2 || !Array.isArray(data[0]) || data[0].length < 2) {
      return JSON.stringify({
        type: chart.chartType || "LineChart",
        data: null,
        error: "Chart data must have at least a header row and one data row, each with at least 2 columns",
      });
    }
  } catch {
    return JSON.stringify({
      type: chart.chartType || "LineChart",
      data: null,
      error: "Invalid chart data JSON",
    });
  }

  // Build options from structured fields
  const options: Record<string, unknown> = {};

  if (chart.colors?.length) {
    options.colors = chart.colors;
  }

  if (chart.seriesType) {
    options.seriesType = chart.seriesType;
  }

  if (chart.isStacked) {
    options.isStacked = "true";
  }

  if (chart.legendPosition) {
    options.legend = { position: chart.legendPosition };
  }

  // Vertical axis
  if (chart.vAxisTitle || chart.vAxisFormat) {
    const vAxis: Record<string, unknown> = {};
    if (chart.vAxisTitle) {
      vAxis.title = chart.vAxisTitle;
      vAxis.titleTextStyle = { bold: true };
    }
    if (chart.vAxisFormat) {
      vAxis.format = chart.vAxisFormat;
    }
    options.vAxis = vAxis;
  }

  // Horizontal axis
  if (chart.hAxisTitle || chart.hAxisFormat) {
    const hAxis: Record<string, unknown> = {};
    if (chart.hAxisTitle) {
      hAxis.title = chart.hAxisTitle;
      hAxis.titleTextStyle = { bold: true };
    }
    if (chart.hAxisFormat) {
      hAxis.format = chart.hAxisFormat;
    }
    options.hAxis = hAxis;
  }

  // Number formatting (applied by GoogleChart's NumberFormat)
  if (chart.numberFormat) {
    const nf: Record<string, string> = {};
    if (chart.numberFormat.prefix) nf.prefix = chart.numberFormat.prefix;
    if (chart.numberFormat.suffix) nf.suffix = chart.numberFormat.suffix;
    if (chart.numberFormat.pattern) nf.pattern = chart.numberFormat.pattern;
    if (Object.keys(nf).length > 0) {
      options.numberFormat = nf;
    }
  }

  // Deep-merge advanced options override — nested objects merge, primitives overwrite
  if (chart.advancedOptions) {
    try {
      const advanced = JSON.parse(chart.advancedOptions);
      if (typeof advanced === "object" && !Array.isArray(advanced)) {
        for (const [key, val] of Object.entries(advanced)) {
          if (typeof val === "object" && val !== null && !Array.isArray(val) &&
              typeof options[key] === "object" && options[key] !== null) {
            options[key] = { ...(options[key] as Record<string, unknown>), ...(val as Record<string, unknown>) };
          } else {
            options[key] = val;
          }
        }
      }
    } catch {
      // Ignore invalid JSON in advanced options
    }
  }

  return JSON.stringify({
    type: chart.chartType,
    data,
    options,
  });
}
