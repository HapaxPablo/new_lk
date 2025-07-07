import Footer from '@/components/ui/footer/Footer'
import Header from '@/components/ui/header/Header'
import { metaDataConfigLayout } from '@/lib/configs/config-meta/configMetaData'
import { AuthProvider } from '@/providers/auth-provider/AuthProvider'
import { NotificationProvider } from '@/providers/notification/NotificationProvider'
import '@/styles/global.css'
import type { Metadata } from 'next'
import localFont from 'next/font/local'

const montserrat = localFont({
  src: [
    {
      path: '../public/font/Montserrat-Light.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../public/font/Montserrat-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/font/Montserrat-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/font/Montserrat-SemiBold.ttf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../public/font/Montserrat-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
})

export const metadata: Metadata = metaDataConfigLayout

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.className} antialiased`}>
        <NotificationProvider>
          <AuthProvider>
            <div className="layout">
              <Header />
              <main className="content">{children}</main>
              <Footer />
            </div>
          </AuthProvider>
        </NotificationProvider>
      </body>
    </html>
  )
}
