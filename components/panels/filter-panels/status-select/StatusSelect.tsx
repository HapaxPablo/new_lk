import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  useEffect,
} from 'react'
import styles from './StatusStyle.module.scss'
import { useClickOutside } from '@/hooks/useClickOutside'
import { ChevronDown } from 'lucide-react'

interface IStatusProps {
  value: string
  onChange: (status: string) => void
  placeholder?: string
  disabled?: boolean
  id: string
}

export interface StatusSelectHandle {
  handleClearAll: () => void
}

interface Option {
  value: string
  label: string
  className?: string
}

const options: Option[] = [
  { value: '3', label: 'Все статусы', className: styles.allStatus },
  { value: '0', label: 'Онлайн', className: styles.online },
  { value: '1', label: 'Оффлайн 5 минут', className: styles.offline5min },
  { value: '2', label: 'Недоступна более часа', className: styles.offline1h },
  {
    value: 'null',
    label: 'Неизвестен или не выходило в сеть',
    className: styles.unknown,
  },
]

const StatusSelect = forwardRef<StatusSelectHandle, IStatusProps>(
  (
    { value, onChange, placeholder, disabled = false, id }: IStatusProps,
    ref
  ) => {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const wrapperRef = useRef<HTMLDivElement>(null)
    const selectRef = useRef<HTMLSelectElement>(null)
    const [internalValue, setInternalValue] = useState<string>(value)

    // Синхронизация внешнего значения
    useEffect(() => {
      setInternalValue(value)
    }, [value])

    // Используем хук для закрытия при клике вне элемента
    useClickOutside(
      [wrapperRef],
      () => {
        setIsOpen(false)
      },
      isOpen,
      true
    )

    const handleClearAll = () => {
      const defaultValue = '3' // "Все статусы"
      setInternalValue(defaultValue)
      onChange(defaultValue)

      // Синхронизация с нативным select
      if (selectRef.current) {
        selectRef.current.value = defaultValue
        selectRef.current.dispatchEvent(new Event('change', { bubbles: true }))
      }
    }

    // Хук для очистки фильтров из родителя
    useImperativeHandle(ref, () => ({
      handleClearAll,
    }))

    const getStatusIcon = (statusValue: string) => {
      switch (statusValue) {
        case '0':
          return '🟢'
        case '1':
          return '🟡'
        case '2':
          return '🔴'
        case 'null':
          return '⚫'
        default:
          return '🔵'
      }
    }

    const handleOptionClick = (optionValue: string) => {
      setInternalValue(optionValue)
      onChange(optionValue)
      setIsOpen(false)

      if (selectRef.current) {
        selectRef.current.value = optionValue
        selectRef.current.dispatchEvent(new Event('change', { bubbles: true }))
        selectRef.current.dispatchEvent(new Event('input', { bubbles: true }))
      }
    }

    const handleCustomSelectClick = () => {
      if (!disabled) {
        setIsOpen(!isOpen)
        // Фокусируем нативный select для доступности
        if (selectRef.current) {
          selectRef.current.focus()
        }
      }
    }

    // Получаем текущую выбранную опцию
    const getSelectedOption = () => {
      return options.find((opt) => opt.value === internalValue) || options[0]
    }

    // Обработка клавиш для доступности
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (disabled) return

      switch (e.key) {
        case 'Enter':
        case ' ':
          e.preventDefault()
          setIsOpen(!isOpen)
          break
        case 'Escape':
          setIsOpen(false)
          break
        case 'ArrowDown':
          e.preventDefault()
          if (!isOpen) {
            setIsOpen(true)
          } else {
            const currentIndex = options.findIndex(
              (opt) => opt.value === internalValue
            )
            const nextIndex = (currentIndex + 1) % options.length
            handleOptionClick(options[nextIndex].value)
          }
          break
        case 'ArrowUp':
          e.preventDefault()
          if (!isOpen) {
            setIsOpen(true)
          } else {
            const currentIndex = options.findIndex(
              (opt) => opt.value === internalValue
            )
            const prevIndex =
              currentIndex > 0 ? currentIndex - 1 : options.length - 1
            handleOptionClick(options[prevIndex].value)
          }
          break
      }
    }

    return (
      <div id={id} className={styles.selectContainer} ref={wrapperRef}>
        <div
          className={`${styles.customSelect} ${isOpen ? styles.open : ''} ${disabled ? styles.disabled : ''}`}
          onClick={handleCustomSelectClick}
          onKeyDown={handleKeyDown}
          tabIndex={disabled ? -1 : 0}
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-controls="status-options"
          aria-disabled={disabled}
        >
          <div className={styles.selectedValue}>
            <span className={styles.selectedIcon}>
              {getStatusIcon(internalValue)}
            </span>
            <span className={styles.selectedLabel}>
              {getSelectedOption().label}
            </span>
            <span
              className={`${styles.arrow} ${isOpen ? styles.arrowUp : styles.arrowDown}`}
            >
              <ChevronDown />
            </span>
          </div>

          {/* Выпадающий список */}
          {isOpen && !disabled && (
            <div
              className={styles.dropdown}
              id="status-options"
              role="listbox"
              aria-label="Статусы"
            >
              {options.map((option) => {
                const isSelected = option.value === internalValue
                return (
                  <div
                    key={option.value}
                    className={`${styles.option} ${option.className || ''} ${isSelected ? styles.selected : ''}`}
                    onClick={() => handleOptionClick(option.value)}
                    role="option"
                    aria-selected={isSelected}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        handleOptionClick(option.value)
                      }
                    }}
                  >
                    <span className={styles.optionIcon}>
                      {getStatusIcon(option.value)}
                    </span>
                    <span className={styles.optionLabel}>{option.label}</span>
                    {isSelected && (
                      <span className={styles.checkmark} aria-hidden="true">
                        ✓
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    )
  }
)
export default StatusSelect
