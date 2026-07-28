import styles from './ListWrapper.module.scss'

interface ListWrapperProps {
  filters?: React.ReactNode
  children: React.ReactNode
  pagination?: React.ReactNode
  className?: string
  contentClassName?: string
  cardsWrapperClassName?: string
  cardsWrapperRef?: React.RefObject<HTMLDivElement | null>
}

export const ListWrapper = ({
  filters,
  children,
  pagination,
  className = '',
  contentClassName = '',
  cardsWrapperClassName = '',
  cardsWrapperRef,
}: ListWrapperProps) => {
  return (
    <div className={`${styles.displayWrapper} ${className}`.trim()}>
      {filters && <div className={styles.filtersContainer}>{filters}</div>}

      <div className={`${styles.contentContainer} ${contentClassName}`.trim()}>
        <div
          ref={cardsWrapperRef}
          className={`${styles.cardsWrapper} ${cardsWrapperClassName}`.trim()}
        >
          {children}
          {pagination ? (
            <div className={styles.paginationContainer}>{pagination}</div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
