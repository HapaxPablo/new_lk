// components/Breadcrumbs/Breadcrumbs.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Home } from 'lucide-react'
import { NAV_ITEMS } from '@/lib/configs/configMenuHeader'
import { useHeaderStore } from '@/store/useHeaderStore'
import styles from './Breadcrumbs.module.scss'

const Breadcrumbs = () => {
  const pathname = usePathname()
  const { subtitle } = useHeaderStore()

  // Разбиваем путь на сегменты, убираем пустые
  const segments = pathname.split('/').filter(Boolean)

  // Ищем корневой раздел (первый сегмент)
  const rootSegment = '/' + segments[0]
  const rootItem = NAV_ITEMS.find((item) => item.path === rootSegment)

  // Если маршрут не из NAV_ITEMS — не показываем крошки
  if (!rootItem) return

  const isDetail = segments.length > 1
  console.log('Breadcrumbs.tsx', {
    pathname,
    segments,
    rootSegment,
    NAV_ITEMS,
    rootItem,
  })

  return (
    <nav aria-label="Хлебные крошки" className={styles.breadcrumbs}>
      {/* Главная */}
      <Link href="/" className={styles.crumb}>
        <Home size={14} />
      </Link>

      <ChevronRight size={14} className={styles.separator} />

      {/* Раздел */}
      {isDetail ? (
        <Link href={rootItem.path} className={styles.crumb}>
          {pathname.includes('/places')
            ? 'Площадки для рекламы'
            : rootItem.title}
        </Link>
      ) : (
        <span className={`${styles.crumb} ${styles.current}`}>
          {rootItem.title}
        </span>
      )}

      {/* Запись (detail-страница) */}
      {isDetail && (
        <>
          <ChevronRight size={14} className={styles.separator} />
          <span className={`${styles.crumb} ${styles.current}`}>
            {subtitle || '...'}
          </span>
        </>
      )}
    </nav>
  )
}

export default Breadcrumbs
