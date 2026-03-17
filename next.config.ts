import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Explicitly set the app's root to this directory
    root: __dirname,
  },
};

export default nextConfig;
