// components/Breadcrumbs/BreadcrumbsSetter.tsx
'use client'

import { useEffect } from 'react'
import { useHeaderStore } from '@/store/useHeaderStore'

interface BreadcrumbsSetterProps {
    title: string
}

const BreadcrumbsSetter = ({ title }: BreadcrumbsSetterProps) => {
    const { setSubtitle, clearSubtitle } = useHeaderStore()

    useEffect(() => {
        if (title) setSubtitle(title)
        return () => clearSubtitle()
    }, [title])

    return null // ничего не рендерит
}

export default BreadcrumbsSetter