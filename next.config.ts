import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000", "*.storeswift.com"]
    }
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com"
      },
      {
        protocol: "https",
        hostname: "**.storeswift.com"
      }
    ]
  }
};

export default nextConfig;
