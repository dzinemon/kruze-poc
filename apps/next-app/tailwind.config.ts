import type { Config } from "tailwindcss";
import kruzePreset from "@kruze-poc/tailwind-config";

const config: Config = {
  presets: [kruzePreset],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}",
  ],
};

export default config;
