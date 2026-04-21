import Image from 'next/image'
import styles from './Header.module.scss'
import InfoMenu from './infoMenu/InfoMenu'
import NavigationMenu from './naviMenu/NavigationMenu'
import UserMenu from './userMenu/UserMenu'
import Link from 'next/link'
import { ModalWrapper } from '@/components/modal/ModalWrapper'
import { SearchForm } from '@/components/search-form/SearchForm'
import Order from './order/Order'

export default function Header() {

  return (
    <header className={styles.header}>
      <div className={styles.wrapper_menu}>
        <Link
          className={styles.header__logo_wrapper}
          href="/nomenclatures"
          aria-label="RMS адрес о нас"
        >
          <div
            className={styles.header__logo_wrapper}
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
          </div>
          {/* <GeolocationClient /> TODO: временно скрыл*/}
        </Link>
        <NavigationMenu />
      </div>
      <div className={styles.wrapper_info_user}>
        {/* <SearchMenu /> */}
        {/* <NotificationMenu /> */}
        <Order />
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
