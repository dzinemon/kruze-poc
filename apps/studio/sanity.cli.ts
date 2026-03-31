import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID!,
    dataset: process.env.SANITY_STUDIO_DATASET!,
  },
  vite: (config) => ({
    ...config,
    build: {
      ...config.build,
      sourcemap: false,
    },
    deployment: {
      appId: process.env.SANITY_APP_ID!,
    },
    optimizeDeps: {
      ...config.optimizeDeps,
      esbuildOptions: {
        ...config.optimizeDeps?.esbuildOptions,
        sourcemap: false,
      },
    },
  }),
});
