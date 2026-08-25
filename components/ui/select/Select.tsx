'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { ChevronDown, X } from 'lucide-react'
import styles from './Select.module.scss'

export interface ISelectOption {
    label: string
    value: string
}

interface SelectProps {
    options: ISelectOption[]
    value: string
    onChange: (value: string) => void
    placeholder?: string
    className?: string
    disabled?: boolean
}

export const Select = ({
    options,
    value,
    onChange,
    placeholder = 'Выберите...',
    className = '',
    disabled = false,
}: SelectProps) => {
    const [isOpen, setIsOpen] = useState(false)
    const [activeIndex, setActiveIndex] = useState(-1)
    const ref = useRef<HTMLDivElement>(null)
    const triggerRef = useRef<HTMLButtonElement>(null)
    const listboxRef = useRef<HTMLUListElement>(null)
    const listboxId = useId()

    const selected = options.find(o => o.value === value)

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    useEffect(() => {
        if (isOpen) listboxRef.current?.focus()
    }, [isOpen])

    useEffect(() => {
        if (options.length === 0) {
            setIsOpen(false)
            return
        }
        if (activeIndex >= options.length) setActiveIndex(options.length - 1)
    }, [activeIndex, options.length])

    const selectedIndex = options.findIndex(option => option.value === value)

    const open = (index = selectedIndex) => {
        if (disabled || options.length === 0) return
        setActiveIndex(index >= 0 ? index : 0)
        setIsOpen(true)
    }

    const selectOption = (index: number) => {
        const option = options[index]
        if (!option) return
        onChange(option.value)
        setIsOpen(false)
        triggerRef.current?.focus()
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
        if (disabled) return

        if (event.key === 'Escape') {
            setIsOpen(false)
            return
        }

        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault()
            if (!isOpen) {
                const direction = event.key === 'ArrowDown' ? 1 : -1
                const currentIndex = selectedIndex >= 0 ? selectedIndex : direction === 1 ? -1 : 0
                open((currentIndex + direction + options.length) % options.length)
                return
            }
            const direction = event.key === 'ArrowDown' ? 1 : -1
            setActiveIndex(current =>
                (current + direction + options.length) % options.length
            )
            return
        }

        if (event.key === 'Home' || event.key === 'End') {
            event.preventDefault()
            if (!isOpen) open(event.key === 'Home' ? 0 : options.length - 1)
            else setActiveIndex(event.key === 'Home' ? 0 : options.length - 1)
            return
        }

        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            if (isOpen) selectOption(activeIndex)
            else open()
        }
    }

    const handleListboxKeyDown = (
        event: React.KeyboardEvent<HTMLUListElement>
    ) => {
        if (event.key === 'Escape') {
            event.preventDefault()
            setIsOpen(false)
            triggerRef.current?.focus()
            return
        }

        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            selectOption(activeIndex)
            return
        }

        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault()
            const direction = event.key === 'ArrowDown' ? 1 : -1
            setActiveIndex(current =>
                (current + direction + options.length) % options.length
            )
            return
        }

        if (event.key === 'Home' || event.key === 'End') {
            event.preventDefault()
            setActiveIndex(event.key === 'Home' ? 0 : options.length - 1)
        }
    }

    return (
        <div ref={ref} className={`${styles.wrapper} ${className}`}>
            <button
                ref={triggerRef}
                type="button"
                disabled={disabled}
                onClick={() => (isOpen ? setIsOpen(false) : open())}
                onKeyDown={handleKeyDown}
                className={styles.button}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                aria-controls={listboxId}
            >
                <span className={styles.label}>
                    {selected ? selected.label : placeholder}
                </span>
                <ChevronDown size={16} className={styles.icon} aria-hidden="true" />
            </button>

            {value && !disabled && (
                <button
                    type="button"
                    className={styles.clearButton}
                    onClick={() => {
                        onChange('')
                        setIsOpen(false)
                    }}
                    aria-label="Очистить выбор"
                >
                    <X
                        size={16}
                        className={styles.icon}
                    />
                </button>
            )}

            {isOpen && !disabled && (
                <ul
                    ref={listboxRef}
                    id={listboxId}
                    className={styles.dropdown}
                    role="listbox"
                    tabIndex={-1}
                    onKeyDown={handleListboxKeyDown}
                    aria-label={placeholder}
                    aria-activedescendant={
                        activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined
                    }
                >
                    {options.length === 0 ? (
                        <li className={styles.empty}>Нет вариантов</li>
                    ) : (
                        options.map((option, index) => (
                            <li
                                key={option.value}
                                id={`${listboxId}-option-${index}`}
                                role="option"
                                aria-selected={option.value === value}
                                onMouseMove={() => setActiveIndex(index)}
                                onClick={() => {
                                    selectOption(index)
                                }}
                                className={`${styles.option} ${option.value === value ? styles.selected : ''} ${index === activeIndex ? styles.active : ''}`}
                            >
                                {option.label}
                            </li>
                        ))
                    )}
                </ul>
            )}
        </div>
    )
}
