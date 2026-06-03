import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  trailingSlash: false,
  env: {
    CRYPTO_SECRET_KEY: process.env.CRYPTO_SECRET_KEY,
    CRYPTO_IV: process.env.CRYPTO_IV,
    API_1C_URL: process.env.API_1C_URL,
    SECRET_COOKIE_PASSWORD: process.env.SECRET_COOKIE_PASSWORD,
  },

  async redirects() {
    const rules: {
      source: string
      has: { type: 'host'; value: string }[]
      destination: string
      permanent: boolean
    }[] = []

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
    if (siteUrl) {
      try {
        const origin = new URL(siteUrl)
        rules.push({
          source: '/:path*',
          has: [{ type: 'host', value: `www.${origin.hostname}` }],
          destination: `${origin.origin}/:path*`,
          permanent: true,
        })
      } catch {
        // ignore invalid SITE_URL
      }
    }

    rules.push({
      source: '/:path*',
      has: [{ type: 'host', value: 'www.krasrm.com' }],
      destination: 'https://krasrm.com/:path*',
      permanent: true,
    })

    rules.push({
      source: '/:path*',
      has: [{ type: 'host', value: 'www.lk.krasrm.com' }],
      destination: 'https://lk.krasrm.com/:path*',
      permanent: true,
    })

    return rules
  },

  async rewrites() {
    // Используем другой префикс для прокси, чтобы не конфликтовать с локальными API
    const apiUrl =
      process.env.NODE_ENV === 'development'
        ? 'http://192.168.0.8:8000/api/:path*'
        : 'https://api1.krasrm.com/api/:path*'

    console.log('🔧 Rewrites enabled, API URL:', apiUrl)
    console.log('Current NODE_ENV:', process.env.NODE_ENV)

    return [
      {
        source: '/accreditation.html',
        destination: '/accreditation',
      },
      {
        source: '/proxy-api/:path*', // Изменено с /api на /proxy-api
        destination: apiUrl,
      },
    ]
  },

  async headers() {
    return [
      {
        source: '/proxy-api/:path*',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization, Cookie, X-XRMC-Cookie',
          },
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true',
          },
        ],
      },
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `
            default-src 'self' 'unsafe-inline' 'unsafe-eval';
            script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.yastatic.net https://api-maps.yandex.ru https://yastatic.net https://mc.yandex.ru;
            style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://yastatic.net;
            img-src 'self' data: blob: https://*.maps.yandex.net https://api-maps.yandex.ru https://cdn2.thecatapi.com https://yandex.ru https://mc.yandex.ru https://api1.krasrm.com http://192.168.0.8:8000;
            font-src 'self' data: https://fonts.gstatic.com;
            connect-src 'self' wss://mc.yandex.ru https://*.yandex.ru https://api.thecatapi.com https://yastatic.net https://mc.yandex.ru https://api1.krasrm.com http://192.168.0.8:8000 ws://192.168.0.8:8000 https://log.api-maps.yandex.ru http://192.168.0.8:7777;
            worker-src blob:;
            frame-src 'self' https://yandex.ru https://*.yandex.ru https://yandex.com https://*.yandex.com;
            object-src 'none';
            base-uri 'self';
            form-action 'self';
            media-src 'self';
          `
              .replace(/\s+/g, ' ')
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
        hostname: 'krasrm.com',
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
        protocol: 'http',
        hostname: '192.168.0.90',
        port: '9001',
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
      {
        protocol: 'http',
        hostname: '192.168.0.8',
        port: '8000',
      },
      {
        protocol: 'https',
        hostname: 'yandex.ru',
      },
      {
        protocol: 'https',
        hostname: 'mc.yandex.ru',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },

  output: 'standalone',
}

export default nextConfig
