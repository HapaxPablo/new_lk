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
    domains: ['test.lk.krasrm.com', 'cdn.example.com', 'api1.krasrm.com'],
    formats: ['image/avif', 'image/webp'],
  },
  output: 'standalone',
}

export default nextConfig
