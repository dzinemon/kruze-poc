import { defineConfig, fontProviders } from "astro/config";
import { readFileSync } from "fs";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

function loadDotEnv(path) {
  try {
    const content = readFileSync(path, "utf-8");
    const env = {};
    for (const line of content.split("\n")) {
      const match = line.match(/^([^#=]+)=(.*)$/);
      if (match) env[match[1].trim()] = match[2].trim();
    }
    return env;
  } catch {
    return {};
  }
}

const localEnv = loadDotEnv(".env.local");

export default defineConfig({
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
    define: {
      __SANITY_PROJECT_ID__: JSON.stringify(
        process.env.SANITY_PROJECT_ID || localEnv.SANITY_PROJECT_ID || localEnv.NEXT_PUBLIC_SANITY_PROJECT_ID
      ),
      __SANITY_DATASET__: JSON.stringify(
        process.env.SANITY_DATASET || localEnv.SANITY_DATASET || localEnv.NEXT_PUBLIC_SANITY_DATASET
      ),
      "process.env.NEXT_PUBLIC_SANITY_PROJECT_ID": JSON.stringify(
        process.env.SANITY_PROJECT_ID || localEnv.SANITY_PROJECT_ID || localEnv.NEXT_PUBLIC_SANITY_PROJECT_ID
      ),
      "process.env.NEXT_PUBLIC_SANITY_DATASET": JSON.stringify(
        process.env.SANITY_DATASET || localEnv.SANITY_DATASET || localEnv.NEXT_PUBLIC_SANITY_DATASET
      ),
    },
    optimizeDeps: {
      include: [
        "react",
        "react-dom",
        "chart.js",
        "react-chartjs-2",
        "@portabletext/react",
      ],
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            // Bundle Chart.js and its dependencies into a single chunk
            if (id.includes("chart.js") || id.includes("react-chartjs-2")) {
              return "charts";
            }
            // Bundle React and React-DOM together
            if (id.includes("node_modules/react") || id.includes("node_modules/react-dom")) {
              return "react-vendor";
            }
          },
        },
      },
    },
  },
  output: "static",
  experimental: {
    fonts: [
      {
        provider: fontProviders.google(),
        name: "Lato",
        cssVariable: "--font-lato",
        subsets: ["latin"],
        weights: ["300", "400", "700", "900"],
      },
    ],
  },
});
