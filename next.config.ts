import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  serverExternalPackages: ['pg'],
  experimental: {
    serverActions: {
      bodySizeLimit: '100mb',
    },
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.hstatic.net' },
      { protocol: 'https', hostname: 'product.hstatic.net' },
      { protocol: 'https', hostname: 'theme.hstatic.net' },
      { protocol: 'https', hostname: 'file.hstatic.net' },
      { protocol: 'https', hostname: 'img.youtube.com' },
      { protocol: 'https', hostname: 'i.ytimg.com' },
    ],
  },
};

export default nextConfig;
