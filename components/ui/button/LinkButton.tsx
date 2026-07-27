'use client'

import React from 'react'
import Link from 'next/link'
import styles from './Button.module.scss'

type ButtonVariant = 'primary' | 'success' | 'warning' | 'error' | 'default' | 'add' | 'detail' | 'navigate' | 'feedback'

interface LinkButtonProps {
    href: string
    variant?: ButtonVariant
    fullWidth?: boolean
    isActive?: boolean
    className?: string
    children: React.ReactNode
    // Дополнительные пропсы от <a>
    target?: string
    rel?: string
}

export const LinkButton = ({
    href,
    variant = 'primary',
    fullWidth = false,
    isActive,
    className = '',
    children,
    target,
    rel,
    ...props
}: LinkButtonProps) => {
    const linkClasses = [
        styles.button,
        styles[`button${variant.charAt(0).toUpperCase() + variant.slice(1)}`],
        fullWidth ? styles.buttonFullWidth : '',
        isActive ? styles.buttonActive : '',
        className,
    ].join(' ')

    return (
        <Link
            href={href}
            className={linkClasses}
            target={target}
            rel={rel}
            {...props}
        >
            {children}
        </Link>
    )
}