import Image from 'next/image'
import { ImageOff } from 'lucide-react'
import styles from './UserAvatar.module.scss'

interface UserAvatarProps {
  src?: string | null
  alt?: string
}

export function UserAvatar({ src, alt }: UserAvatarProps) {
  return (
    <div className={styles.avatar}>
      {src ? (
        <Image
          src={src}
          alt={alt ?? 'Аватар пользователя'}
          fill
          className={styles.avatar__image}
          sizes="80px"
        />
      ) : (
        <div className={styles.avatar__placeholder}>
          <ImageOff size={24} />
          <span>Нет изображения</span>
        </div>
      )}
    </div>
  )
}
