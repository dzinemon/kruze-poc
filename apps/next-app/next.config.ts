import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  trailingSlash: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/**",
      },
    ],
  },
  transpilePackages: [
    "@kruze-poc/ui",
    "@kruze-poc/groq-queries",
    "@kruze-poc/sanity-schemas",
    "@kruze-poc/tailwind-config",
  ],
};

export default nextConfig;
