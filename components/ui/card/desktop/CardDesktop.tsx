import styles from './CardDesktop.module.scss'

interface CardDesktopProps {
  className?: string
  children: React.ReactNode
}

export const CardDesktop: React.FC<CardDesktopProps> = ({
  className = '',
  children,
}) => (
  <div
    className={`rounded-lg shadow-sm hover:shadow-md transition-shadow ${className} ${styles.cardMobile}`}
  >
    {children}
  </div>
)
