import { useEffect, RefObject } from 'react'

type ClickOutsideRef = RefObject<HTMLElement | null>

/**
 * хук для обработки кликов вне указанных элементов и нажатия клавиши Esc
 *
 * @param refs - массив ref-объектов, которые нужно отслеживать
 * @param callback - функция, которая вызывается при клике вне всех указанных элементов или нажатии Esc
 * @param enabled - флаг включения/выключения обработчика (по умолчанию true)
 * @param enableEscape - флаг включения/выключения обработки клавиши Esc (по умолчанию true)
 *
 * @example
 * // Использование в компоненте:
 * const modalRef = useRef<HTMLDivElement>(null)
 * useClickOutside([modalRef], () => setIsOpen(false), isOpen, true)
 */
export const useClickOutside = (
  refs: ClickOutsideRef[], // Массив ref-объектов для отслеживания
  callback: () => void, // Колбэк, вызываемый при клике вне элементов или нажатии Esc
  enabled: boolean = true, // Флаг активности хука
  enableEscape: boolean = true // Флаг обработки клавиши Esc
): void => {
  useEffect(() => {
    // Если хук отключен, ничего не делаем
    if (!enabled) return

    /**
     * Обработчик клика по документу
     * @param event - событие мыши
     */
    const handleClickOutside = (event: MouseEvent): void => {
      // Проверяем, что клик произошел ВНЕ всех отслеживаемых элементов
      const isOutsideAll = refs.every(
        (ref) =>
          // Условие: элемент существует И клик НЕ внутри этого элемента
          ref.current && !ref.current.contains(event.target as Node)
      )

      // Если клик вне всех элементов - вызываем колбэк
      if (isOutsideAll) {
        callback()
      }
    }

    /**
     * Обработчик нажатия клавиши
     * @param event - событие клавиатуры
     */
    const handleKeyDown = (event: KeyboardEvent): void => {
      // Если нажата клавиша Esc и обработка Esc включена
      if (event.key === 'Escape' && enableEscape) {
        callback()
      }
    }

    // Добавляем обработчик события mousedown на весь документ
    document.addEventListener('mousedown', handleClickOutside)

    // Добавляем обработчик события keydown для клавиши Esc
    document.addEventListener('keydown', handleKeyDown)

    // Функция очистки: удаляем обработчики при размонтировании компонента
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [refs, callback, enabled, enableEscape])
}
