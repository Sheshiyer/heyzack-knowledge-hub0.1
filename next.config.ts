import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: '/data-sources/:path*',
        destination: '/data-sources/:path*',
      },
    ];
  },
  webpack: (config: any) => {
    // Copy data-sources to public directory during build
    config.module.rules.push({
      test: /\.(md|txt)$/,
      use: 'raw-loader',
    });
    return config;
  },
};

export default nextConfig;
