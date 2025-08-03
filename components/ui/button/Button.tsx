'use client'

import React, { ButtonHTMLAttributes } from 'react'
import styles from './Button.module.scss'

type ButtonVariant = 'primary' | 'success' | 'warning' | 'error' | 'default'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  isLoading?: boolean
  fullWidth?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      isLoading = false,
      fullWidth = false,
      className = '',
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const buttonClasses = [
      styles.button,
      styles[`button${variant.charAt(0).toUpperCase() + variant.slice(1)}`],
      fullWidth ? styles.buttonFullWidth : '',
      className,
    ].join(' ')

    return (
      <button
        ref={ref}
        className={buttonClasses}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
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
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
