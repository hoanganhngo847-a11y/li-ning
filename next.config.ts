import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.hstatic.net' },
      { protocol: 'https', hostname: 'product.hstatic.net' },
      { protocol: 'https', hostname: 'theme.hstatic.net' },
      { protocol: 'https', hostname: 'file.hstatic.net' },
    ],
  },
};

export default nextConfig;
