import styles from './CardMobile.module.scss'

interface CardMobileProps {
  className?: string
  children: React.ReactNode
}

export const CardMobile: React.FC<CardMobileProps> = ({
  className = '',
  children,
}) => (
  <div
    className={`rounded-lg shadow-sm hover:shadow-md transition-shadow ${className} ${styles.cardMobile}`}
  >
    {children}
  </div>
)
