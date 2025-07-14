import { Phone } from 'lucide-react'
import styles from './Card.module.scss'
export default function Card() {
  return (
    <div className={styles.container}>
      <div className={styles.container__logoGroup}>
        <img
          src="/wall.jpg"
          alt="wall"
          className={styles.container__logoGroup__logo}
        />
        <img
          src="/wall.jpg"
          alt="wall"
          className={styles.container__logoGroup__photo}
        />
      </div>
      <div className={styles.container__descriptionWrapper}>
        <div className={styles.container__descriptionWrapper__position}>
          <div className={styles.container__descriptionWrapper__position__icon}>
            <Phone width={24} height={24} />
          </div>
          <div className={styles.container__descriptionWrapper__position__text}>
            +7 999 999 99 99
          </div>
        </div>
      </div>
    </div>
  )
}
