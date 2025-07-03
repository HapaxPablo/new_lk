'use client'
import Image from 'next/image'
import styles from './Header.module.scss'
import NavigationMenu from './naviMenu/NavigationMenu'
import { useRouter } from 'next/navigation'

export default function Header() {
  const router = useRouter()
  const onClickLogo = () => {
    router.push('/about', { scroll: false })
  }
  return (
    <div className={styles.header}>
      <div className={styles.header__logo_wrapper} onClick={onClickLogo}>
        <Image
          className={styles.header__logo}
          src="/logo.svg"
          alt="logo"
          width={120}
          height={24}
          priority={true}
          title="логотип-rmc"
          aria-label="logo"
        />
      </div>
      <NavigationMenu />
    </div>
  )
}
