import '@/styles/index.css'
import { INomenclatureItem } from '@/types/nomenclature'
import Image from 'next/image'
import { FieldValue } from '../../fields/fieldValue/FieldValue'
import styles from './CardDesktop.module.scss'
interface CardDesktopProps {
  className?: string
  onClick?: () => void
  item: INomenclatureItem
  children?: React.ReactNode
}

export const CardDesktop: React.FC<CardDesktopProps> = ({
  item,
  className = '',
  children,
  onClick,
}) => (
  <article onClick={onClick} className={`${className} ${styles.cardMobile}`}>
    <figure className={styles.figure}>
      {item.exterior.length > 0 && (
        <div className={styles.outsideImageWrapper}>
          <Image
            src={item.exterior[0].source}
            alt={`Фасад магазина ${item.brand}`}
            fill
            sizes="(max-width: 600px) 100vw, 600px"
            loading="lazy"
          />
        </div>
      )}
    </figure>

    <section className={styles.infoSection}>
      {item.brand && item.brand.logo && item.brand.logo !== "" ? (
        <div className={styles.logotypeImageWrapper}>
          <Image
            src={item.brand.logo}
            alt={`Логотип бренда ${item.brand.name}`}
            fill
            style={{ objectFit: 'contain' }}
            sizes="(max-width: 320px) 100vw, 320px"
            loading="lazy"
          />
        </div>
      ) : null}
      {item.legalEntity && (
        <div className={styles.infoRow}>
          {/* <FieldLabel text="Юр. лицо:" /> */}
          <FieldValue
            text={`${item.legalEntity}`.trim()}
            type="h3"
            ariaLabel={`Юр лицо ${item.brand}`}
          />
        </div>
      )}
      {/* {(item.brand || item.typeOfPlace) && ( */}
      <header className={styles.header}>
        <div className={styles.header}>
          {/* <FieldLabel text="Бренд:" /> */}
          <FieldValue
            text={
              <>
                {item.typeOfPlace ? item.typeOfPlace : <span className="text-red-500">Тип места нет</span>}
                {" "}
                {item.brand ? (
                  item.brand.name
                ) : (
                  <span className="text-red-500">Бренда нет</span>
                )}
              </>
            }
            type="h3"
            ariaLabel="Основной бренд места"
          />
        </div>
      </header>
      {/* )} */}

      {item.contentType && (
        <div className={styles.infoRow}>
          {/* <FieldLabel text="Тип ролика:" /> */}
          <FieldValue
            text={`${item.contentType}`}
            ariaLabel={`Тип размещаемого ролика в ${item.brand}`}
          />
        </div>
      )}

      {item.address && (
        <div className={styles.infoRow}>
          {/* <FieldLabel text="Адрес:" /> */}
          <FieldValue
            text={`${item.address.city}, ${item.address.street},
                ${item.address.street_house}`}
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
    {children}
  </article>
)
