'use client'
import Image from 'next/image'
import styles from './Header.module.scss'
import { useRouter } from 'next/navigation'
import NavigationMenu from './navi-menu/NavigationMenu'
import InfoMenu from './info-menu/InfoMenu'
import UserMenu from './user-menu/UserMenu'

export default function Header() {
  const router = useRouter()
  const onClickLogo = () => {
    router.push('/about', { scroll: false })
  }
  return (
    <div className={styles.header}>
      <div className={styles.wrapper_menu}>
        <div className={styles.header__logo_wrapper} onClick={onClickLogo}>
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
        <NavigationMenu />
      </div>
      <div className={styles.wrapper_info_user}>
        <InfoMenu />
        <UserMenu />
      </div>
    </div>
  )
}
