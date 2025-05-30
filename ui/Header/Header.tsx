'use client'
import Image from 'next/image'
import styles from './Header.module.scss'
import logo from './logo.svg'

export default function Header() {
	return (
		<div className={styles.header}>
			<Image
				className={styles.header__logo}
				height={24}
				width={120}
				alt='logo'
				src={logo}
				loading='lazy'
			/>
		</div>
	)
}
