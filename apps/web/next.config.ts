import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    console.log('Setting up rewrites for API proxying');
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3001/api/:path*',
      },
    ]
  },
};

export default nextConfig;
