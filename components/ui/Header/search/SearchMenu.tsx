'use client'

import { Search } from 'lucide-react'
import styles from './SearchMenu.module.scss'
import { useModal } from '@/providers/modal/ModalProvider'


const SearchMenu = () => {
  const { openModal } = useModal('search')

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    openModal()
  }

  return (
    <button
      onClick={handleClick}
      className={styles.searchMenu}
      aria-label="Открыть поиск"
    >
      <Search size={24} className={styles.searchMenu__icon} />
    </button>
  )
}

export default SearchMenu