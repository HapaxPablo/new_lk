import Image from 'next/image'
import styles from './Header.module.scss'
import InfoMenu from './infoMenu/InfoMenu'
import NavigationMenu from './naviMenu/NavigationMenu'
import UserMenu from './userMenu/UserMenu'
import Link from 'next/link'
import SearchMenu from './search/SearchMenu'
import NotificationMenu from './notification/NotificationMenu'
import { ModalWrapper } from '@/components/modal/ModalWrapper'
import { SearchForm } from '@/components/search-form/SearchForm'

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.wrapper_menu}>
        <Link
          className={styles.header__logo_wrapper}
          href="/about"
          aria-label="RMS адрес о нас"
        >
          <Image
            className={styles.header__logo}
            src="/logo.svg"
            alt="logo"
            width={120}
            height={24}
            priority
            title="логотип-rmc"
            aria-label="logo"
          />
        </Link>
        <NavigationMenu />
      </div>
      <div className={styles.wrapper_info_user}>
        <SearchMenu />
        <NotificationMenu />
        <InfoMenu />
        <UserMenu />
      </div>
      {/* //TODO добавить логику в форме закрытия модального окна после выполнения запроса */}
      <ModalWrapper id="search" title="Поиск">
        <SearchForm hideButton />
      </ModalWrapper>
       <ModalWrapper id="notifications" title="Уведомления">
      <div className="notifications-content">
        {/* TODO добавить компонент с уведомлениями */}
        что то с Уведомления
      </div>
    </ModalWrapper>
    </header>
  )
}
