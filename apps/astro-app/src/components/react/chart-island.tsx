import { GoogleChart } from "@kruze-poc/ui/chart";
import type { ComponentProps } from "react";

export default function ChartIsland(props: ComponentProps<typeof GoogleChart>) {
  return <GoogleChart {...props} />;
}
