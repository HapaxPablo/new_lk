'use client';
//TODO данный компонент так же нужно сделать переиспользуемым по аналогии с поиском
// href должен быть динамически изменяемым в зависимости от маршрута api
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface PaginationProps {
  total: number;
  limit: number;
  offset: number;
}

export function Pagination({ total, limit, offset }: PaginationProps) {
  const searchParams = useSearchParams();
  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.ceil(total / limit);

  const createQueryString = (newOffset: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('offset', newOffset.toString());
    return params.toString();
  };

  return (
    <div className="flex justify-between items-center mt-8">
      <Link
        href={`/nomenclatures?${createQueryString(Math.max(0, offset - limit))}`}
        className={`px-4 py-2 rounded ${
          offset === 0 
            ? 'bg-gray-300 cursor-not-allowed text-gray-500' 
            : 'bg-blue-500 text-white hover:bg-blue-600'
        } transition-colors`}
        aria-disabled={offset === 0}
      >
        Назад
      </Link>
      
      <span className="text-gray-700">
        Страница {currentPage} из {totalPages} (Всего: {total})
      </span>
      
      <Link
        href={`/nomenclatures?${createQueryString(offset + limit)}`}
        className={`px-4 py-2 rounded ${
          offset + limit >= total 
            ? 'bg-gray-300 cursor-not-allowed text-gray-500' 
            : 'bg-blue-500 text-white hover:bg-blue-600'
        } transition-colors`}
        aria-disabled={offset + limit >= total}
      >
        Вперед
      </Link>
    </div>
  );
}