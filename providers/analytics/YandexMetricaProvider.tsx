'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import Script from 'next/script'

interface ym {
    (counterId: number, method: string, ...args: unknown[]): void
}

declare global {
    interface Window {
        ym?: ym
        dataLayer?: unknown[]
    }
}

export function YandexMetricaProvider() {
    const metricaId = process.env.NEXT_PUBLIC_YANDEX_METRICA_ID

    const pathname = usePathname()
    const searchParams = useSearchParams()

    useEffect(() => {
        if (!metricaId || !window.ym) return

        const query = searchParams.toString()

        const url = query
            ? `${pathname}?${query}`
            : pathname

        window.ym(Number(metricaId), 'hit', url, {
            title: document.title,
        })
    }, [pathname, searchParams, metricaId])

    useEffect(() => {
        if (!metricaId) return

        if (!window.dataLayer) {
            window.dataLayer = []
        }
    }, [metricaId])

    if (!metricaId) {
        return null
    }

    return (
        <>
            <Script
                id="yandex-metrica"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
            (function(m,e,t,r,i,k,a){
              m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
              m[i].l=1*new Date();

              for (var j = 0; j < document.scripts.length; j++) {
                if (document.scripts[j].src === r) { return; }
              }

              k=e.createElement(t),
              a=e.getElementsByTagName(t)[0],
              k.async=1,
              k.src=r,
              a.parentNode.insertBefore(k,a)
            })(window, document,'script',
            'https://mc.yandex.ru/metrika/tag.js', 'ym');

            ym(${metricaId}, 'init', {
              webvisor: false,
              clickmap: true,
              trackLinks: true,
              accurateTrackBounce: true,
              ecommerce: 'dataLayer'
            });
          `,
                }}
            />

            <noscript>
                <div>
                    <img
                        src={`https://mc.yandex.ru/watch/${metricaId}`}
                        style={{ position: 'absolute', left: '-9999px' }}
                        alt="Яндекс.Метрика"
                    />
                </div>
            </noscript>
        </>
    )
}