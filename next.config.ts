import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for Cloudflare Pages
  output: 'standalone',

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

export default nextConfig;
// Trigger Next.js Dev Server Restart
