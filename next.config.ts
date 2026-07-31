import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "172.20.10.4",
    "172.20.10.4:3000",
    "192.168.29.241",
    "192.168.29.241:3000",
    "192.168.1.55",
    "192.168.1.55:3000",
    "localhost",
    "localhost:3000",
    "127.0.0.1",
    "127.0.0.1:3000",
  ],
  outputFileTracingExcludes: {
    "*": [
      "./public/uploads/**/*",
    ],
  },
  turbopack: {
    ignoreIssue: [
      {
        path: "**/next.config.ts",
        description: /Encountered unexpected file in NFT list/,
      },
    ],
  },
};

export default nextConfig;
