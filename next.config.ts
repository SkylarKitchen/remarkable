import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
  // The Sanity Studio uses styled-components; enable the compiler support.
  compiler: {
    styledComponents: true,
  },
  typescript: {
    // Studio + app share a tsconfig; keep builds resilient during scaffolding.
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
