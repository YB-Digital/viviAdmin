import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  output: "standalone",

  env: {
    API_BASE_URL:
      process.env.NODE_ENV === "development"
        ? "https://ybdigitalx.com/vivi_backend/"
        : "http://localhost/vivi_backend/",
  },

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "viviacademy.de" },
      { protocol: "http", hostname: "viviacademy.de" },
      { protocol: "http", hostname: "localhost" },
      { protocol: "http", hostname: "127.0.0.1" }
    ],
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,POST,PUT,DELETE,OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization" }
        ],
      },
    ];
  }
};

export default nextConfig;