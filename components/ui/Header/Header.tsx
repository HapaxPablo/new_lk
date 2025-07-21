import Image from 'next/image'
import styles from './Header.module.scss'
import InfoMenu from './infoMenu/InfoMenu'
import NavigationMenu from './naviMenu/NavigationMenu'
import UserMenu from './userMenu/UserMenu'
import Link from 'next/link'
import SearchMenu from './search/SearchMenu'
import NotificationMenu from './notification/NotificationMenu'

export default function Header() {

  return (
    <div className={styles.header}>
      <div className={styles.wrapper_menu}>
        <Link className={styles.header__logo_wrapper} href="/about" aria-label="RMS адрес о нас">
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
    </div>
  )
}
