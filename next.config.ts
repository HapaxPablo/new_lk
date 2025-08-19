import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  env: {
    CRYPTO_SECRET_KEY: process.env.CRYPTO_SECRET_KEY,
    CRYPTO_IV: process.env.CRYPTO_IV,
    API_1C_URL: process.env.API_1C_URL,
    SECRET_COOKIE_PASSWORD: process.env.SECRET_COOKIE_PASSWORD,
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [{ key: 'Access-Control-Allow-Origin', value: '*' }],
      },
    ]
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'test.lk.krasrm.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.example.com',
      },
      {
        protocol: 'https',
        hostname: 'api1.krasrm.com',
      },
      {
        protocol: 'http',
        hostname: '192.168.0.61',
        pathname: '/local-media/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn2.thecatapi.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  output: 'standalone',
}

export default nextConfig
