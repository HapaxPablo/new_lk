'use client'

import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button/Button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState, useMemo } from 'react'
import styles from './Pagination.module.scss'
import { useMediaQuery } from 'usehooks-ts'

interface PaginationProps {
  total: number
  limit: number
  page: number
  infiniteScroll?: boolean
  showPageNumbers?: boolean
  className?: string
}

export function Pagination({
  total,
  limit,
  page,
  infiniteScroll = true,
  showPageNumbers = false,
  className = '',
}: PaginationProps) {
  const searchParams = useSearchParams()
  const pathName = usePathname()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const isMobile = useMediaQuery('(max-width: 768px)')
  
  const currentPage = Number(page) || 1
  const totalPages = Math.ceil(total / limit)

  // Если режим infinite scroll, показываем только информацию
  if (infiniteScroll) {
    return (
      <div className={`${styles.paginationContainer} ${className}`}>
        <div className={styles.pageInfo}>
          <span className={styles.infoText}>
            Загружено страниц: {currentPage}
          </span>
          <span className={styles.totalText}>
            Всего позиций: <strong>{total}</strong>
          </span>
          {currentPage < totalPages && (
            <span className={styles.loadingHint}>
              Прокрутите вниз для загрузки следующих позиций
            </span>
          )}
        </div>
      </div>
    )
  }

  // Генерируем массив номеров страниц для отображения (только для обычной пагинации)
  const pageNumbers = useMemo(() => {
    if (infiniteScroll) return []
    
    const numbers = []
    const maxVisiblePages = isMobile ? 3 : 7
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    if (startPage > 1) {
      numbers.push(1)
      if (startPage > 2) {
        numbers.push('...')
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      numbers.push(i)
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        numbers.push('...')
      }
      numbers.push(totalPages)
    }

    return numbers
  }, [currentPage, totalPages, isMobile, infiniteScroll])

  const handlePageChange = async (newPage: number) => {
    if (infiniteScroll) return
    if (newPage < 1 || newPage > totalPages || newPage === currentPage) return

    setIsLoading(true)
    try {
      const params = new URLSearchParams(searchParams.toString())
      params.set('page', newPage.toString())
      await router.push(`${pathName}?${params.toString()}`, {
        scroll: true,
      })
    } catch (error) {
      console.error('Error changing page:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Если всего 1 страница, не показываем пагинацию
  if (totalPages <= 1) return null

  const isFirstPage = currentPage <= 1
  const isLastPage = currentPage >= totalPages

  return (
    <div className={`${styles.paginationContainer} ${className}`}>
      <div className={styles.paginationContent}>
        <Button
          variant="primary"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={isFirstPage || isLoading}
          isLoading={isLoading}
          className={styles.navButton}
          aria-label="Предыдущая страница"
        >
          <ChevronLeft />
          <span className={styles.buttonText}>Назад</span>
        </Button>

        {showPageNumbers && (
          <div className={styles.pageNumbers}>
            {pageNumbers.map((pageNum, index) => {
              if (pageNum === '...') {
                return (
                  <span key={`ellipsis-${index}`} className={styles.ellipsis}>
                    ...
                  </span>
                )
              }

              const pageNumber = pageNum as number
              const isActive = currentPage === pageNumber

              return (
                <Button
                  key={`page-${pageNumber}`}
                  variant={isActive ? 'primary' : 'default'}
                  onClick={() => handlePageChange(pageNumber)}
                  disabled={isLoading}
                  className={`${styles.pageButton} ${isActive ? styles.active : ''}`}
                  aria-label={`Страница ${pageNumber}`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {pageNumber}
                </Button>
              )
            })}
          </div>
        )}

        <Button
          variant="primary"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={isLastPage || isLoading}
          isLoading={isLoading}
          className={styles.navButton}
          aria-label="Следующая страница"
        >
          <span className={styles.buttonText}>Вперед</span>
          <ChevronRight />
        </Button>
      </div>

      <div className={styles.pageInfo}>
        <span className={styles.infoText}>
          Страница {currentPage} из {totalPages}
        </span>
        <span className={styles.totalText}>
          Всего: <strong>{total}</strong>
        </span>
      </div>
    </div>
  )
}