// components/ui/button/Button.tsx
'use client'

import React, { ButtonHTMLAttributes, AnchorHTMLAttributes } from 'react'
import styles from './Button.module.scss'

type ButtonVariant = 'primary' | 'success' | 'warning' | 'error' | 'default' | "add" | "detail" | "navigate" | "feedback"

// Базовые пропсы общие для кнопки и ссылки
interface ButtonBaseProps {
  variant?: ButtonVariant
  isLoading?: boolean
  fullWidth?: boolean
  isActive?: boolean
  className?: string
  children?: React.ReactNode
}

// Пропсы для кнопки
interface ButtonAsButtonProps extends ButtonBaseProps, Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps | 'href'> {
  href?: never
}

// Пропсы для ссылки
interface ButtonAsLinkProps extends ButtonBaseProps, Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof ButtonBaseProps> {
  href: string
}

type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps

export const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  (props, ref) => {
    const {
      variant = 'primary',
      isLoading = false,
      fullWidth = false,
      className = '',
      children,
      isActive,
      ...rest
    } = props

    const buttonClasses = [
      styles.button,
      styles[`button${variant.charAt(0).toUpperCase() + variant.slice(1)}`],
      fullWidth ? styles.buttonFullWidth : '',
      isActive ? styles.buttonActive : '',
      className,
    ].join(' ')

    const spinner = isLoading && (
      <svg
        className={styles.spinner}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        width="16"
        height="16"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    )

    // Если есть href - рендерим как <a>
    if ('href' in props && props.href) {
      const { href, ...anchorProps } = rest as AnchorHTMLAttributes<HTMLAnchorElement>

      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          className="flex-shrink-0 px-4 py-1.5 text-blue-900! bg-gray-200 hover:bg-blue-50 hover:text-blue-600 border border-transparent hover:border-blue-200 rounded-full text-sm whitespace-nowrap transition-all"

          {...anchorProps}
        >
          {spinner}
          {children}
        </a>
      )
    }

    // Иначе рендерим как <button>
    const { disabled, ...buttonProps } = rest as ButtonHTMLAttributes<HTMLButtonElement>

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        className={buttonClasses}
        disabled={disabled || isLoading}
        {...buttonProps}
      >
        {spinner}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'