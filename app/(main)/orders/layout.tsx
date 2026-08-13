import type { Metadata } from 'next'

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
}

export default function OrdersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <section className="min-h-full bg-slate-50 overflow-y-auto">
      {children}
    </section>
  )
}
