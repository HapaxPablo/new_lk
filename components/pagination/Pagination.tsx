'use client'

import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button/Button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'

interface PaginationProps {
  total: number
  limit: number
  page: number
}

export function Pagination({ total, limit, page }: PaginationProps) {
  const searchParams = useSearchParams()
  const pathName = usePathname()
  const router = useRouter()
  const currentPage = Number(page) || 1
  const totalPages = Math.ceil(total / limit)

  const [isLoading, setIsLoading] = useState(false)

  const handlePageChange = async (newPage: number) => {
    setIsLoading(true)
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', newPage.toString())
    await router.push(`${pathName}?${params.toString()}`)
    setIsLoading(false)
  }

  const isFirstPage = currentPage <= 1
  const isLastPage = currentPage >= totalPages

  return (
    <div className="flex justify-between items-center">
      <Button
        variant="primary"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={isFirstPage || isLoading}
        isLoading={isLoading && !isFirstPage}
        className="p-2 md:px-4 md:py-2 rounded-md"
        aria-label="Предыдущая страница"
      >
        <span className="hidden md:inline">Назад</span>
        <ChevronLeft className="md:hidden h-5 w-5" />
      </Button>
      <span className="text-gray-700">
        Страница {currentPage} из {totalPages} (Всего : {total})
      </span>
      <Button
        variant="primary"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={isLastPage || isLoading}
        isLoading={isLoading && !isLastPage}
        className="p-2 md:px-4 md:py-2 rounded-md"
        aria-label="Следующая страница"
      >
        <span className="hidden md:inline">Вперед</span>
        <ChevronRight className="md:hidden h-5 w-5" />{' '}
      </Button>
    </div>
  )
}
