'use client'

import { useEffect } from 'react'
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

    useEffect(() => {
        if (!metricaId) {
            console.warn(
                '[SEO] NEXT_PUBLIC_YANDEX_METRICA_ID не установлен в переменных окружения'
            )
            return
        }

        // Инициализируем dataLayer для e-commerce отслеживания
        if (!window.dataLayer) {
            window.dataLayer = []
        }
    }, [metricaId])

    if (!metricaId) {
        return null
    }

    const metricaScript = `
    (function(m,e,t,r,i,k,a){
      m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
      m[i].l=1*new Date();
      for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
      k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
    })(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=${metricaId}', 'ym');

    ym(${metricaId}, 'init', {
      ssr: true,
      webvisor: true,
      clickmap: true,
      ecommerce: 'dataLayer',
      referrer: document.referrer,
      url: location.href,
      accurateTrackBounce: true,
      trackLinks: true
    });
  `

    return (
        <>
            <Script
                id="yandex-metrica"
                strategy="lazyOnload"
                dangerouslySetInnerHTML={{
                    __html: metricaScript,
                }}
            />
            <noscript>
                <div>
                    <img
                        src={`https://mc.yandex.ru/watch/${metricaId}`}
                        style={{ position: 'absolute', left: '-9999px' }}
                        alt=""
                    />
                </div>
            </noscript>
        </>
    )
}