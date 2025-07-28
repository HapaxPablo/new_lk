import { CardDesktop } from '@/components/ui/card/desktop/CardDesktop'
import { FieldLabel } from '@/components/ui/fields/fieldLabel/FieldLabel'
import { FieldValue } from '@/components/ui/fields/fieldValue/FeildValue'
import { INomenclatureItem } from '@/types/nomenclature'
import Image from 'next/image'
import styles from './NomenclatureItemDesktop.module.scss'
import { useRouter } from 'next/navigation'


interface NomenclatureCardProps {
  item: INomenclatureItem[]
  className?: string
}

export const NomenclatureItemDesktop: React.FC<NomenclatureCardProps> = ({
  item,
  className = '',
}) => {
  const router = useRouter()
  	const handleClickCard = (article: string) => {
		// Переход на страницу с расшифровкой
		router.push(`nomenclatures/${article}`)
	}

  return (
    <>
      {item.map((item, key) => (
        <CardDesktop onClick={() => handleClickCard(item.article)} key={key} className={`${className}`}>
          <figure className={styles.figure}>
            {item.outSidePhotoURL && (
              <div className={styles.outsideImageWrapper}>
                <Image
                  src={item.outSidePhotoURL}
                  alt={`Фасад магазина ${item.brand}`}
                  fill
                  sizes="(max-width: 600px) 100vw, 600px"
                  loading="lazy"
                />
              </div>
            )}
          </figure>

          <section className={styles.infoSection}>
            {item.logotypeURL && (
              <div className={styles.logotypeImageWrapper}>
                <Image
                  src={item.logotypeURL}
                  alt={`Логотип бренда ${item.brand}`}
                  fill
                  style={{ objectFit: 'contain' }}
                  sizes="(max-width: 320px) 100vw, 320px"
                  loading="lazy"
                />
              </div>
            )}
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
        </CardDesktop>
      ))}
    </>
  )
}
