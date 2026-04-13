/**
 * Input shape for buildChartJsonConfig — what the function needs.
 * Keep in sync with ChartDocument in @kruze-poc/sanity-schemas/src/types/index.ts
 */
export interface ChartDocumentData {
  _id: string;
  title: string;
  data: string;
  colors?: string[];
  options: string; // JSON: { chartType, ...googleChartsOptions }
}

/**
 * Converts a chart document into the jsonConfig string
 * that GoogleChart expects: { type, data, options }
 *
 * The options field is a raw Google Charts options JSON object
 * with chartType included. Colors from the dedicated field
 * take precedence over colors in the options JSON.
 */
export function buildChartJsonConfig(chart: ChartDocumentData): string {
  // Parse the data table JSON array
  let data: Array<Array<string | number>>;
  try {
    if (!chart.data) {
      return JSON.stringify({
        type: "LineChart",
        data: null,
        error: "No chart data provided",
      });
    }
    data = JSON.parse(chart.data);
    if (!Array.isArray(data) || data.length < 2 || !Array.isArray(data[0]) || data[0].length < 2) {
      return JSON.stringify({
        type: "LineChart",
        data: null,
        error: "Chart data must have at least a header row and one data row, each with at least 2 columns",
      });
    }
  } catch {
    return JSON.stringify({
      type: "LineChart",
      data: null,
      error: "Invalid chart data JSON",
    });
  }

  // Parse options JSON — extract chartType, pass rest through
  let parsedOptions: Record<string, unknown> = {};
  let chartType = "LineChart";
  try {
    parsedOptions = JSON.parse(chart.options || "{}");
    chartType = (parsedOptions.chartType as string) || "LineChart";
    delete parsedOptions.chartType;
  } catch {
    // fall through with defaults
  }

  // Colors from dedicated field take precedence
  if (chart.colors?.length) {
    parsedOptions.colors = chart.colors;
  }

  return JSON.stringify({
    type: chartType,
    data,
    options: parsedOptions,
  });
}

/**
 * Extract aspectRatio from the options JSON string.
 * Returns "4/3" as default if not specified or on parse error.
 */
export function getChartAspectRatio(optionsJson?: string): string {
  try {
    return (JSON.parse(optionsJson || "{}")).aspectRatio || "4/3";
  } catch {
    return "4/3";
  }
}
