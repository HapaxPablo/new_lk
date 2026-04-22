import Footer from '@/components/ui/footer/Footer'
import Header from '@/components/ui/header/Header'
import { TooltipModal } from '@/components/ui/tooltip/TooltipModal'
import { metaDataConfigLayout, SITE_URL } from '@/lib/configs/config-meta/configMetaData'
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
    telephone: '+7-800-500-50-50',
    email: 'info@krasrm.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'ул. Красной Армии, 10, стр. 3., оф. 2-02',
      addressLocality: 'Красноярск',
      addressCountry: 'RU',
    },
    sameAs: [],
  }

  return (
    <html lang="ru">
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
        <YandexMetricaProvider />
        <AuthProvider>
          <ModalProvider>
            <TooltipProvider>
              <ToastProvider>
                <SWRProvider>
                  <div className="layout">
                    <Header />
                    <Breadcrumbs />
                    <main className="content">{children} </main>
                    <Footer />
                    <TooltipModal />
                  </div>
                </SWRProvider>
              </ToastProvider>
            </TooltipProvider>
          </ModalProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
