import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['localhost', 'cloud.appwrite.io'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cloud.appwrite.io',
        pathname: '/v1/storage/files/**',
      },
    ],
    unoptimized: true,
  },
};

export default nextConfig;
