'use client'

import { Search } from 'lucide-react'
import styles from './SearchMenu.module.scss'

const SearchMenu = () => {
  return (
    <div className={styles.searchMenu}>
      <Search
        size={24}
        aria-hidden="false"
        aria-label="Поиск"
        role="button"
        className={styles.searchMenu__icon}
      />
    </div>
  )
}

export default SearchMenu
