import type { NextConfig } from "next";

// Proxy /api/* to the Flask backend so the browser only ever talks to this
// origin (localhost:3100). Keeps the frontend and backend on a single address
// in the browser and sidesteps CORS. Override the target with BACKEND_ORIGIN.
const BACKEND_ORIGIN = process.env.BACKEND_ORIGIN ?? "http://localhost:5000";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${BACKEND_ORIGIN}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
