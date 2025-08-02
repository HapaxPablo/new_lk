import { CardMobile } from '@/components/ui/card/mobile/CardMobile'
import { FieldLabel } from '@/components/ui/fields/fieldLabel/FieldLabel'
import { FieldValue } from '@/components/ui/fields/fieldValue/FieldValue'
import { INomenclatureItem } from '@/types/nomenclature'
import Image from 'next/image'
import React from 'react'
import styles from '../desktop/NomenclatureItemDesktop.module.scss'

interface NomenclatureCardProps {
  item: INomenclatureItem
  className?: string
}

export const NomenclatureItemMobile: React.FC<NomenclatureCardProps> = ({
  item,
  className = '',
}) => {
  return (
    <article className={`relative ${className}`}>
      <CardMobile>
        <span
          className="absolute right-2 top-2 text-gray-400 text-[0.5rem]"
          aria-label="Артикул товара"
        >
          {item.article}
        </span>

        <div className="flex flex-row gap-2 items-center">
          <figure
            className="grid h-full w-1/3"
            style={{ gridTemplateRows: '20% 5% 75%' }}
          >
            {item.logotypeURL && (
              <Image
                src={item.logotypeURL}
                alt={`Логотип бренда ${item.brand}`}
                width={100}
                height={100}
                className="w-full h-full object-cover"
                style={{ gridRow: '1 / 2' }}
                loading="lazy"
              />
            )}

            <div style={{ gridRow: '2 / 3' }} />
            {item.outSidePhotoURL && (
              <Image
                src={item.outSidePhotoURL}
                alt={`Фасад магазина ${item.brand}`}
                width={100}
                height={100}
                className="w-full h-full object-cover"
                style={{ gridRow: '3 / 4' }}
                loading="lazy"
              />
            )}
          </figure>

          <section className={styles.infoSection}>
            {item.legalEntity && (
              <div className={styles.infoRow}>
                <FieldLabel text="Юр. лицо:" />
                <FieldValue
                  text={`${item.legalEntity}`.trim()}
                  type="h3"
                  ariaLabel={`Юр лицо ${item.brand}`}
                />
              </div>
            )}
            {(item.brand || item.typeOfPlace) && (
              <header className={styles.header}>
                <div className={styles.header}>
                  <FieldLabel text="Бренд:" />
                  <FieldValue
                    text={`${item.typeOfPlace} ${item.brand}`.trim()}
                    type="h3"
                    ariaLabel="Основной бренд места"
                  />
                </div>
              </header>
            )}

            {item.contentType && (
              <div className={styles.infoRow}>
                <FieldLabel text="Тип ролика:" />
                <FieldValue
                  text={`${item.contentType}`}
                  ariaLabel={`Тип размещаемого ролика в ${item.brand}`}
                />
              </div>
            )}

            {item.address && (
              <div className={styles.infoRow}>
                <FieldLabel text="Адрес:" />
                <FieldValue
                  text={`${item.address.city}, ${item.address.street},
                ${item.address.streetHouse}`}
                  type="address"
                  ariaLabel={`Адрес размещения ${item.brand}`}
                />
              </div>
            )}

            {/*
          TODO: раскомментить когда появятся роли *для сотрудников* 
          {item.article && (
            <div className={styles.infoRow}>
              <label className={styles.labelSmall}>Артикул:</label>
              <span className={styles.article} aria-label="Артикул товара">
                {item.article}
              </span>
            </div>
          )} */}
          </section>
        </div>
      </CardMobile>
    </article>
  )
}
