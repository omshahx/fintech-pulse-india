import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow external images from news sources
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
};

export default nextConfig;
