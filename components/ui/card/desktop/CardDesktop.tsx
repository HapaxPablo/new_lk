import styles from './CardDesktop.module.scss'

interface CardDesktopProps {
  className?: string
  children: React.ReactNode
}

export const CardDesktop: React.FC<CardDesktopProps> = ({
  className = '',
  children,
}) => (
  <article
    className={`shadow-sm hover:shadow-lg transition-shadow ${className} ${styles.cardMobile}`}
  >
    {children}
  </article>
)
