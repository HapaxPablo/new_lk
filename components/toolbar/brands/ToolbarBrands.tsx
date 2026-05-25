'use client'
import { useClickOutside } from '@/hooks/useClickOutside'
import { JSX, useRef, useState } from 'react'
import styles from '../Toolbar.module.scss'
import { SearchForm } from '@/components/search-form/SearchForm'

interface ToolbarProps {
    totalItems: number
}

const ToolbarBrands = ({ totalItems }: ToolbarProps): JSX.Element => {
    const [showLimitOptions, setShowLimitOptions] = useState<boolean>(false)

    const limitRef = useRef<HTMLDivElement>(null)

    useClickOutside(
        [limitRef],
        () => setShowLimitOptions(false),
        showLimitOptions
    )
    return (
        <>
            <div className={styles.toolbar}>
                <div className={styles.mainPanel}>
                    <div className={styles.totalItems}>Всего: {totalItems}</div>
                    <SearchForm hideButton className={styles.searchForm} placeholder='Напишите здесь название бренда, описание, или сокращение транслитом' />
                </div>
            </div>

        </>
    )
}

export default ToolbarBrands