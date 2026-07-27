import Footer from '@/components/ui/footer/Footer'
import Header from '@/components/ui/header/Header'
import { TooltipModal } from '@/components/ui/tooltip/TooltipModal'
import {
  metaDataConfigLayout,
  SITE_URL,
} from '@/lib/configs/config-meta/configMetaData'
import { AuthProvider } from '@/providers/auth-provider/AuthProvider'
import { ModalProvider } from '@/providers/modal/ModalProvider'
import { ToastProvider } from '@/providers/toast/ToastProvider'
import { TooltipProvider } from '@/providers/tooltip/TooltipProvider'
import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { SWRProvider } from '@/providers/swr/SwrProvider'
import GeolocationClient from '@/components/ui/geolocation/GeolocationClient'
import Script from 'next/script'
import { YandexMetricaProvider } from '@/providers/analytics/YandexMetricaProvider'
import Breadcrumbs from '@/components/ui/breadcrumbs/Breadcrumbs'
import { NomenclatureStoreProvider } from '@/providers/nomenclature/NomenclatureStoreProvider'
import CookieBanner from '@/components/ui/cookies/CookieBanner'
import { Suspense } from 'react'
import { GoogleAnalytics } from '@next/third-parties/google'
import { MantineProvider } from '@/providers/mantine/MantineProvider'
import '@mantine/core/styles.css'
const montserrat = localFont({
  src: [
    {
      path: '../public/font/Montserrat-Light.ttf',
      weight: '300',
      // style: 'normal',
    },
    {
      path: '../public/font/Montserrat-Regular.ttf',
      weight: '400',
      // style: 'normal',
    },
    {
      path: '../public/font/Montserrat-Medium.ttf',
      weight: '500',
      // style: 'normal',
    },
    {
      path: '../public/font/Montserrat-SemiBold.ttf',
      weight: '600',
      // style: 'normal',
    },
    {
      path: '../public/font/Montserrat-Bold.ttf',
      weight: '700',
      // style: 'normal',
    },
  ],
  display: 'swap', // Рекомендуется для оптимизации загрузки шрифтов
})

export const metadata: Metadata = metaDataConfigLayout

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Organization JSON-LD структурированные данные
  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Агентство активной рекламы ААР',
    image: `${SITE_URL}/og-logo.jpg`,
    description: 'Агентство активной рекламы в Красноярске',
    url: SITE_URL,
    telephone: '+7-800-222-59-38',
    email: 'info@krasrm.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'ул. Красной Армии, 10, стр. 3., оф. 2-02',
      addressLocality: 'Красноярск',
      addressCountry: 'RU',
      postalCode: '660017',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ],
        opens: '09:00',
        closes: '18:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Понедельник',
          'Вторник',
          'Среда',
          'Четверг',
          'Пятница',
          'Суббота',
          'Воскресенье',
        ],
        opens: '09:00',
        closes: '18:00',
      },
    ],
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 56.014468,
      longitude: 92.854937,
    },
    priceRange: '$$',
    logo: `${SITE_URL}/logo.svg`,
    founder: {
      '@type': 'Person',
      name: 'Говядин Антон Иванович',
      sameAs: 'https://vk.com/antongovyadin',
    },
    areaServed: {
      '@type': 'GeoCircle',
      geoMidpoint: {
        '@type': 'GeoCoordinates',
        latitude: 56.014468,
        longitude: 92.854937,
      },
      geoRadius: 1000,
    },
    sameAs: 'https://vk.com/krasrm',
  }

  return (
    <html lang="ru">
      <meta charSet="UTF-8" />
      <head>
        <Script
          id="organization-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
      </head>
      <body className={`${montserrat.className} antialiased`}>
        <Suspense fallback={null}>
          <YandexMetricaProvider />
        </Suspense>

        <AuthProvider>
          <MantineProvider>
            <ModalProvider>
              <TooltipProvider>
                <ToastProvider>
                  <SWRProvider>
                    <NomenclatureStoreProvider>
                      <div className="layout">
                        <Header />

                        <Suspense fallback={null}>
                          <Breadcrumbs />
                        </Suspense>

                        <main className="content">{children}</main>

                        <Footer />
                        <TooltipModal />
                        <Suspense fallback={null}>
                          <CookieBanner />
                        </Suspense>
                      </div>
                    </NomenclatureStoreProvider>
                  </SWRProvider>
                </ToastProvider>
              </TooltipProvider>
            </ModalProvider>
          </MantineProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
