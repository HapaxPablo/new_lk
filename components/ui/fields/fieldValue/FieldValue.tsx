import styles from './FieldValue.module.scss'

interface FieldValueProps {
  text: string | React.ReactNode
  className?: string
  itemProp?: string
  ariaLabel?: string
  lang?: string
  title?: string
  type?: 'span' | 'h3' | 'address'
  onClick?: () => void
}

export const FieldValue: React.FC<FieldValueProps> = ({
  text,
  className = '',
  itemProp,
  ariaLabel,
  lang,
  title,
  type = 'span',
  onClick,
}) => {
  const Tag = type
  const props: any = { className, 'aria-label': ariaLabel }
  return (
    <Tag
      {...props}
      className={`${styles.value} ${className}`}
      itemProp={itemProp}
      aria-label={ariaLabel}
      lang={lang}
      title={title}
      onClick={onClick}
    >
      {text}
    </Tag>
  )
}
