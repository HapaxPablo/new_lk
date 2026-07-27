'use client'

import { SearchForm } from '@/components/search-form/SearchForm'
import { JSX } from 'react'
import styles from '../Toolbar.module.scss'

interface ToolbarTenantsProps {
  totalItems: number
}

const ToolbarTenants = ({ totalItems }: ToolbarTenantsProps): JSX.Element => {
  return (
    <div className={styles.toolbar}>
      <div className={styles.mainPanel}>
        <div className={styles.totalItems}>Всего: {totalItems}</div>
        <SearchForm
          hideButton
          className={styles.searchForm}
          placeholder="Введите бренд, арендатора или код 1С"
        />
      </div>
    </div>
  )
}

export default ToolbarTenants
