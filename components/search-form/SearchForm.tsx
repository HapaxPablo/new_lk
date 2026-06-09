'use client'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useRef, useState, useTransition } from 'react'
import { useDebounceCallback } from 'usehooks-ts'
import { Button } from '../ui/button/Button'
import { X } from 'lucide-react'
// import { Loader } from '../ui/loader/Loader'

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

  /**
   * Дополнительные CSS-классы для инпута
   * @default ''
   */
  inputClassName?: string
}

/**
 * Универсальный компонент поиска с поддержкой:
 * - Автоматического поиска с debounce при вводе
 * - Ручного поиска по кнопке/Enter
 * - Синхронизации с URL-параметрами
 * - Кастомизации внешнего вида
 * - Кнопки очистки инпута
 */
export function SearchForm({
  initialSearch = '',
  placeholder = 'Поиск...',
  searchParamName = 'search',
  className = '',
  debounceDelay = 1000,
  hideButton = false,
  buttonText = 'Найти',
  buttonClassName = '',
  inputClassName = '',
}: SearchFormProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const inputRef = useRef<HTMLInputElement>(null)
  const searchValue = searchParams.get('search')
  const [isFocused, setIsFocused] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [inputValue, setInputValue] = useState(
    searchValue ? searchValue : initialSearch
  )

  // Создаем debounce-функцию для обработки ввода
  // Создаем debounce-функцию для обработки ввода
  const debouncedSearch = useDebounceCallback((value: string) => {
    // не отправляем если меньше 3 символов (но разрешаем пустую строку — для сброса)
    if (value.length > 0 && value.length < 3) return

    const params = new URLSearchParams(searchParams.toString())

    if (value) {
      params.set(searchParamName, value)
    } else {
      params.delete(searchParamName)
    }
    params.delete('page')
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`)
    })
  }, debounceDelay)



  // Обработчик отправки формы (по кнопке или Enter)
  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      debouncedSearch.cancel()

      const formData = new FormData(e.currentTarget)
      const searchValue = formData.get(searchParamName) as string

      // не отправляем если меньше 3 символов
      if (searchValue.length > 0 && searchValue.length < 3) return

      debouncedSearch(searchValue)
    },
    [debouncedSearch, searchParamName]
  )
  // Обработчик изменения инпута
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)
    debouncedSearch(value)
  }

  // Обработчик очистки инпута
  const handleClearInput = useCallback(() => {
    setInputValue('')

    // Фокусируемся на инпуте после очистки
    if (inputRef.current) {
      inputRef.current.focus()
    }

    // Отменяем отложенный debounce-запрос и сразу очищаем
    debouncedSearch.cancel()

    const params = new URLSearchParams(searchParams.toString())
    params.delete(searchParamName)
    params.delete('page') // Сбрасываем пагинацию

    router.push(`${pathname}?${params.toString()}`)
  }, [debouncedSearch, searchParamName, pathname, router, searchParams])

  // Синхронизация initialSearch с состоянием при изменении извне
  // useEffect(() => {
  //   setInputValue(initialSearch)
  // }, [initialSearch])

  // Обработчик нажатия клавиши Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && document.activeElement === inputRef.current) {
        handleClearInput()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleClearInput])

  return (
    <>

      {/* {isPending && <Loader size="large" variant="primary" />} */}

      <form
        onSubmit={handleSubmit}
        className={`flex ${className} ${hideButton ? 'rounded' : ''}`}
      >

        <div className={`relative flex-grow`}>
          <input
            ref={inputRef}
            type="text"
            name={searchParamName}
            placeholder={placeholder}
            value={inputValue}
            onChange={handleInputChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}

            className={`w-full px-4 py-2 border ${hideButton ? 'rounded' : 'rounded-l'} ${inputClassName} focus:outline-none focus:ring-2 focus:ring-blue-300 pr-10`}
          />

          {/* Кнопка очистки */}
          {inputValue && (
            <button
              type="button"
              onClick={handleClearInput}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
              aria-label="Очистить поиск"
            >
              <X size={18} />
            </button>
          )}

          {isFocused && inputValue.length < 3 && (
            <div className="absolute left-0 top-full mt-1 z-50 px-2 py-1 text-xs text-white bg-gray-700 rounded shadow whitespace-nowrap">
              Введите минимум 3 символа
              <div className="absolute -top-1 left-4 w-2 h-2 bg-gray-700 rotate-45" />
            </div>
          )}
        </div>

        {!hideButton && (
          <Button
            type="submit"
            variant="default"
            className={`rounded-l-none ${buttonClassName}`}
          >
            {buttonText}
          </Button>
        )}
      </form>
    </>
  )
}
