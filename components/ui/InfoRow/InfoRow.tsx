import { ReactNode } from 'react'
import styles from './InfoRow.module.scss'

interface InfoRowProps {
  icon?: ReactNode
  label: string
  value: string | ReactNode
  className?: string
  labelClassName?: string
  valueClassName?: string
}

export const InfoRow: React.FC<InfoRowProps> = ({
  icon,
  label,
  value,
  className = '',
  labelClassName = '',
  valueClassName = '',
}) => {
  return (
    <div className={`${styles.infoRow} ${className}`}>
      {icon && <div className={styles.icon}>{icon}</div>}
      <div className={styles.textContent}>
        <span className={`${styles.label} ${labelClassName}`}>{label}</span>
        <span className={`${styles.value} ${valueClassName}`}>{value}</span>
      </div>
    </div>
  )
}
