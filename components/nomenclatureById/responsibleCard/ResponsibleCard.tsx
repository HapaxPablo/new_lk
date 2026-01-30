'use client'

import styles from './ResponsibleCard.module.scss'
import { ModalWrapper } from '@/components/modal/ModalWrapper'
import UserInfoModal from '@/components/user/UserInfoModal'
import { useModal } from '@/providers/modal/ModalProvider'
import { ReactNode, Suspense } from 'react'

interface Props {
  label: string
  icon: ReactNode
  name: string
  id?: string
  color?: string
}

export function ResponsibleCard({
  label,
  icon,
  name,
  id,
  color = 'bg-gray-100',
}: Props) {
  const modalKey = id ?? 'unknown'
  const { openModal } = useModal('responsible_details', modalKey)

  return (
    <>
      <article
        className={`${styles.wrapper} ${color}`}
        onClick={() => id && openModal()}
      >
        <header className={styles.wrapper__header}>
          {icon}
          <h3 className="font-medium">{label}</h3>
        </header>
        <div className={styles.wrapper__content}>{name}</div>
      </article>

      {id && (
        <ModalWrapper
          id="responsible_details"
          title={`Контактная информация`}
          keyId={modalKey}
        >
          <UserInfoModal userId={id} />
        </ModalWrapper>
      )}
    </>
  )
}
