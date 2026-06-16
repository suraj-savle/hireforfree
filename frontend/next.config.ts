import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Local Development
      {
        protocol: "http",
        hostname: "localhost",
        port: "3001",
        pathname: "/uploads/**",
      },

      // Production Backend
      {
        protocol: "https",
        hostname: "api.hireforfree.com",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;