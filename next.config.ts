import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  trailingSlash: true,

  // env: {
  //   API_BASE_URL:
  //     process.env.NODE_ENV === "development"
  //       ? "http://localhost:3000"
  //       : "https://api.viviacademy.xyz",
  // },
  env: {
    NEXT_PUBLIC_API_BASE_URL: "https://api.viviacademy.xyz",
  },

  images: {
    unoptimized: true,
  },

  // async headers() {
  //   return [
  //     {
  //       source: "/api/:path*",
  //       headers: [
  //         { key: "Access-Control-Allow-Credentials", value: "true" },
  //         { key: "Access-Control-Allow-Origin", value: "*" },
  //         {
  //           key: "Access-Control-Allow-Methods",
  //           value: "GET,POST,PUT,DELETE,OPTIONS",
  //         },
  //         {
  //           key: "Access-Control-Allow-Headers",
  //           value: "Content-Type, Authorization",
  //         },
  //       ],
  //     },
  //   ];
  // },

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://api.viviacademy.xyz/:path*",
      },
    ];
  },
};

export default nextConfig;
