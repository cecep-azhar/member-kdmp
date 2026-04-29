import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === "development",
  workboxOptions: {
    disableDevLogs: true,
  },
});

const nextConfig: NextConfig = {
  // Enable standalone output for Cloudflare Pages
  output: 'standalone',

  // Empty turbopack config to silence warning (PWA uses webpack)
  turbopack: {},

  // Image optimization configuration for Cloudflare
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    unoptimized: true, // Disable built-in image optimization for Cloudflare
  },
};

export default withPWA(nextConfig);
// Trigger Next.js Dev Server Restart
