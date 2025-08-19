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
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `
        default-src 'self';
        script-src 'self' 'unsafe-inline' 'unsafe-eval' https://api-maps.yandex.ru https://yastatic.net;
        connect-src 'self' https://api-maps.yandex.ru https://api.thecatapi.com https://yastatic.net;
        img-src 'self' data: blob: https://*.maps.yandex.net https://api-maps.yandex.ru https://cdn2.thecatapi.com https://yandex.ru;
        style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://yastatic.net;
        font-src 'self' data: https://fonts.gstatic.com;
      `
              .replace(/\s{2,}/g, ' ')
              .trim(),
          },
        ],
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
      {
        protocol: 'https',
        hostname: 'api.thecatapi.com',
      },
      {
        protocol: 'https',
        hostname: 'api-maps.yandex.ru',
      },
    ],
    domains: [
      'test.lk.krasrm.com',
      'cdn.example.com',
      'api-maps.yandex.ru',
      'api.thecatapi.com',
    ],
    formats: ['image/avif', 'image/webp'],
  },
  output: 'standalone',
}

export default nextConfig
