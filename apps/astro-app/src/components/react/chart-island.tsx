import { DemoChart } from "@kruze-poc/ui/chart/demo-chart";
import type { ComponentProps } from "react";

export default function ChartIsland(props: ComponentProps<typeof DemoChart>) {
  return <DemoChart {...props} />;
}
