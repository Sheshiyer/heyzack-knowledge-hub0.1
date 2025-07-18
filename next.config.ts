import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export for Cloudflare Pages
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  
  // Rewrite rule to serve data-sources content
  async rewrites() {
    return [
      {
        source: '/data-sources/:path*',
        destination: '/data-sources/:path*',
      },
    ];
  },
  
  webpack: (config) => {
    // Add raw-loader for .md and .txt files
    config.module.rules.push({
      test: /\.(md|txt)$/,
      use: 'raw-loader',
    });
    
    return config;
  },
};

export default nextConfig;
