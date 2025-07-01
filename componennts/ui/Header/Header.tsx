import Image from 'next/image'
import styles from './Header.module.scss'


export default function Header() {
  return (
    <div className={styles.header}>
      <Image
	   className={styles.header__logo}
      src='/logo.svg'
	  alt='logo'
	  width={120}
	  height={24}
	  priority
      />
    </div>
  )
}
