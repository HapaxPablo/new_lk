import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['test.lk.krasrm.com', 'cdn.example.com'],
    formats: ['image/avif', 'image/webp'],
  },
  output: 'standalone',
}

export default nextConfig
