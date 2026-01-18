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
  showPageNumbers?: boolean
  className?: string
}

export function Pagination({
  total,
  limit,
  page,
  showPageNumbers = true,
  className = '',
}: PaginationProps) {
  const searchParams = useSearchParams()
  const pathName = usePathname()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const isMobile = useMediaQuery('(max-width: 768px)')
  const currentPage = Number(page)
  const totalPages = Math.ceil(total / limit)

  // Генерируем массив номеров страниц для отображения
  const pageNumbers = useMemo(() => {
    const numbers = []
    const maxVisiblePages = isMobile ? 3 : 7 // Сколько страниц показывать вокруг текущей
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    // Корректируем если подошли к концу
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    // Добавляем первую страницу и многоточие
    if (startPage > 1) {
      numbers.push(1)
      if (startPage > 2) {
        numbers.push('...')
      }
    }

    // Добавляем основные страницы
    for (let i = startPage; i <= endPage; i++) {
      numbers.push(i)
    }

    // Добавляем последнюю страницу и многоточие
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        numbers.push('...')
      }
      numbers.push(totalPages)
    }

    return numbers
  }, [currentPage, totalPages])

  const handlePageChange = async (newPage: number) => {
    if (newPage < 1 || newPage > totalPages || newPage === currentPage) return

    setIsLoading(true)
    try {
      const params = new URLSearchParams(searchParams.toString())
      params.set('page', newPage.toString())
      // Используем push вместо replace, чтобы сохранить в истории
      await router.replace(`${pathName}?${params.toString()}`, {
        scroll: false,
      })
    } catch (error) {
      console.error('Error changing page:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const isFirstPage = currentPage <= 1
  const isLastPage = currentPage >= totalPages

  // Если всего 1 страница, не показываем пагинацию
  if (totalPages <= 1) return null

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
        <div className={styles.pageNumber}>
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
        </div>
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
          Страница <strong>{currentPage}</strong> из{' '}
          <strong>{totalPages}</strong>
        </span>
        <span className={styles.totalText}>
          Всего: <strong>{total}</strong> мест размещения
        </span>
      </div>
    </div>
  )
}
