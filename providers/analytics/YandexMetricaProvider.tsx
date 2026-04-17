'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

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
    const pathname = usePathname()
    const metricaId = process.env.NEXT_PUBLIC_YANDEX_METRICA_ID

    console.log('[SEO DEBUG]', {
        metricaId,
        siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
    })

    useEffect(() => {
        if (!metricaId) {
            console.warn(
                '[SEO] NEXT_PUBLIC_YANDEX_METRICA_ID не установлен в переменных окружения'
            )
            return
        }

        // Вставляем скрипт Яндекс.Метрики
        if (!window.ym) {
            const script = document.createElement('script')
            script.async = true
            script.src = 'https://mc.yandex.ru/metrica/tag.js'

            script.onload = () => {
                if (window.ym) {
                    window.ym(parseInt(metricaId), 'init', {
                        clickmap: true,
                        trackLinks: true,
                        accurateTrackBounce: true,
                        webvisor: true,
                    })
                }
            }

            document.head.appendChild(script)

            // Инициализируем счетчик через глобальный объект
            window.ym = function (
                _counterId: number,
                _method: string,
                ..._args: unknown[]
            ) {
                if (window.dataLayer) {
                    window.dataLayer.push({
                        counterId: _counterId,
                        method: _method,
                        args: _args,
                    })
                }
            }
            window.dataLayer = window.dataLayer || []
        }
    }, [metricaId])

    // Отправляем просмотры страниц при смене маршрута
    useEffect(() => {
        if (window.ym && metricaId) {
            window.ym(parseInt(metricaId), 'hit', pathname)
        }
    }, [pathname, metricaId])

    return null
}
