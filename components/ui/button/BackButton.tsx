'use client'

import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { Button } from './Button'
import styles from './BackButton.module.scss'

interface BackButtonProps {
  className?: string
  variant?:
    | 'primary'
    | 'success'
    | 'warning'
    | 'error'
    | 'default'
    | 'add'
    | 'detail'
    | 'navigate'
  to?: string
}

export function BackButton({
  className = '',
  variant = 'navigate',
  to = '/nomenclatures',
  ...props
}: BackButtonProps) {
  return (
    <Link href={to} className={`${styles.backButtonWrapper} ${className}`}>
      <Button variant={variant} {...props}>
        <ChevronLeft size={20} />
      </Button>
        Вернуться назад
    </Link>
  )
}
