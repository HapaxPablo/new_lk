'use client'
//TODO нужно сделать стили под десктоп и мобилу, текущие стили для наглядности
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useDebounceCallback } from 'usehooks-ts'
import { useCallback, useEffect, useRef } from 'react'
import { Button } from '../ui/button/Button'

interface SearchFormProps {
  /**
   * Начальное значение поискового запроса
   * @default ''
   */
  initialSearch?: string

  /**
   * Текст-подсказка в поле ввода
   * @default 'Поиск...'
   */
  placeholder?: string

  /**
   * Имя параметра в URL для поискового запроса
   * @default 'searchValue'
   */
  searchParamName?: string

  /**
   * Дополнительные CSS-классы для формы
   * @default ''
   */
  className?: string

  /**
   * Задержка в миллисекундах перед автоматическим поиском при вводе
   * @default 500
   */
  debounceDelay?: number

  /**
   * Скрыть кнопку поиска (поиск будет только по debounce)
   * @default false
   */
  hideButton?: boolean

  /**
   * Текст на кнопке поиска
   * @default 'Найти'
   */
  buttonText?: string

  /**
   * Дополнительные CSS-классы для кнопки
   * @default ''
   */
  buttonClassName?: string
}

/**
 * Универсальный компонент поиска с поддержкой:
 * - Автоматического поиска с debounce при вводе
 * - Ручного поиска по кнопке/Enter
 * - Синхронизации с URL-параметрами
 * - Кастомизации внешнего вида
 */
export function SearchForm({
  initialSearch = '',
  placeholder = 'Поиск...',
  searchParamName = 'searchValue',
  className = '',
  debounceDelay = 800,
  hideButton = false,
  buttonText = 'Найти',
  buttonClassName = '',
}: SearchFormProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const inputRef = useRef<HTMLInputElement>(null)

  // Создаем debounce-функцию для обработки ввода
  const debouncedSearch = useDebounceCallback((value: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (value) {
      params.set(searchParamName, value)
    } else {
      params.delete(searchParamName)
    }
    // params.delete('offset') // Сбрасываем пагинацию
    router.push(`${pathname}?${params.toString()}`)
  }, debounceDelay)

  // Обработчик отправки формы (по кнопке или Enter)
  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      // Отменяем отложенный debounce-запрос
      debouncedSearch.cancel()

      const formData = new FormData(e.currentTarget)
      const searchValue = formData.get(searchParamName) as string
      debouncedSearch(searchValue)
    },
    [debouncedSearch, searchParamName]
  )

  // Обработчик изменения инпута
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value)
  }

  // Синхронизация initialSearch с input при изменении извне
  useEffect(() => {
    if (inputRef.current && initialSearch !== inputRef.current.value) {
      inputRef.current.value = initialSearch
    }
  }, [initialSearch])

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex ${className} ${hideButton ? 'rounded' : ''}`}
    >
      <input
        ref={inputRef}
        type="text"
        name={searchParamName}
        placeholder={placeholder}
        defaultValue={initialSearch}
        onChange={handleInputChange}
        className={`px-4 py-2 border ${hideButton ? 'rounded' : 'rounded-l'} flex-grow focus:outline-none focus:ring-2 focus:ring-blue-300`}
      />
      {!hideButton && (
        <Button type="submit" variant="primary" className={buttonClassName}>
          {buttonText}
        </Button>
      )}
    </form>
  )
}
