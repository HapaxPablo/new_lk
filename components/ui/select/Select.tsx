'use client'

import { useEffect, useRef, useState } from 'react'
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
    const ref = useRef<HTMLDivElement>(null)

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
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsOpen(false)
        }
        document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [])

    return (
        <div ref={ref} className={`${styles.wrapper} ${className}`}>
            <button
                type="button"
                disabled={disabled}
                onClick={() => setIsOpen(prev => !prev)}
                className={styles.button}
            >
                <span className={styles.label}>
                    {selected ? selected.label : placeholder}
                </span>
                {value ? (
                    <X
                        size={16}
                        className={styles.icon}
                        onClick={e => {
                            e.stopPropagation()
                            onChange('')
                            setIsOpen(false)
                        }}
                    />
                ) : (
                    <ChevronDown size={16} className={styles.icon} />
                )}
            </button>

            {isOpen && !disabled && (
                <ul className={styles.dropdown}>
                    {options.length === 0 ? (
                        <li className={styles.empty}>Нет вариантов</li>
                    ) : (
                        options.map(option => (
                            <li
                                key={option.value}
                                onClick={() => {
                                    onChange(option.value)
                                    setIsOpen(false)
                                }}
                                className={`${styles.option} ${option.value === value ? styles.selected : ''}`}
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