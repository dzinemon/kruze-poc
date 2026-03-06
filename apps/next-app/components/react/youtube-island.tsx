"use client";

import { YouTubeFacade } from "@kruze-poc/ui/portable-text/youtube-facade";
import type { ComponentProps } from "react";

export default function YouTubeIsland(
  props: ComponentProps<typeof YouTubeFacade>
) {
  return <YouTubeFacade {...props} />;
}
