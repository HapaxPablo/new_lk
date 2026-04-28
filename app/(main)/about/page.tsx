import type { Metadata } from 'next'
import { Users, Target, Radio, Cpu } from 'lucide-react'
import Feedback from '@/components/ui/forms/feedback/Feedback'
import styles from './About.module.scss'
import { MapPlacement } from '@/components/nomenclatureById'
import { Button } from '@/components/ui/button/Button'
import ContactButton from './ContactButton'
import { headers } from 'next/headers'

export const metadata: Metadata = {
  title: 'О компании RMC — Indoor реклама',
  description:
    'Размещение рекламы в супермаркетах и ТЦ по всей России. Аудио и видеореклама.',
}

export default async function AboutPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'RMC',
    url: 'https://krasrm.com',
    telephone: '+78002225938',
  }

  const headersList = await headers()
  const isMobile = headersList.get('x-is-mobile') === '1'

  return (
    <main className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* HERO */}
      <div className={styles.hero}>
        <div className={styles.container}>
          <h1 className={styles.title}>Indoor-реклама, которая продаёт</h1>
          <p className={styles.subtitle}>
            Размещаем рекламу в супермаркетах и ТЦ по всей России
          </p>
          <ContactButton className={styles.ctaBlock} />
        </div>
      </div>

      {/* ABOUT */}
      <div className={styles.section}>
        <div className={styles.container}>
          <h2 className='text-2xl w-full flex items-center justify-center'>О компании</h2>
          <p className={styles.text}>
            RMC — мультимедийная сеть indoor-рекламы, работающая по всей России.
            Мы размещаем рекламу в супермаркетах и торговых центрах с высокой
            проходимостью.
          </p>
          <p className={styles.text}>
            Помогаем бизнесу находить клиентов в момент принятия решения о покупке.
          </p>
        </div>
      </div>

      {/* ADVANTAGES */}
      <div className={styles.sectionGray}>
        <div className={styles.container}>
          <h2 className='text-2xl w-full flex items-center justify-center'>Преимущества</h2>
          <div className={styles.grid4}>
            <div className={styles.card}>
              <p>Высокая проходимость</p>
            </div>
            <div className={styles.card}>
              <p>Точное попадание в аудиторию</p>
            </div>
            <div className={styles.card}>
              <p>Гибкие форматы</p>
            </div>
            <div className={styles.card}>
              <p>Собственные технологии</p>
            </div>
          </div>
        </div>
      </div>

      {/* SERVICES */}
      <div className={styles.section}>
        <div className={styles.container}>
          <h2 className='text-2xl w-full flex items-center justify-center'>Что мы предлагаем</h2>
          <div className={styles.grid3}>
            <div className={styles.card}>Размещение: Аудиореклама, Видеореклама</div>
            <div className={styles.card}>Корпоративное вещание</div>
            <div className={styles.card}>Производство роликов</div>
          </div>
          <div className={styles.ctaBlock}>
            <h3 className='text-lg w-full flex items-center justify-center'>Готовы запустить рекламу?</h3>
            <ContactButton className={styles.ctaBlock} />
          </div>
        </div>
      </div>

      {/* TECH */}
      <div className={styles.section}>
        <div className={styles.container}>
          <div className={styles.grid2}>
            <div>
              <h2 className='text-2xl w-full flex items-center justify-center'>Технологии</h2>
              <p className={styles.text}>
                Собственное ПО и решения на базе Raspberry Pi и Orange Pi
                обеспечивают стабильность вещания.
              </p>
            </div>
            <div className={styles.techBox}>Tech Preview</div>
          </div>
        </div>
      </div>
      {/* CONTACTS */}
      <div className={styles.sectionGray}>
        <div className={styles.container}>
          <h2 className='text-2xl w-full flex items-center justify-center'>Контакты</h2>
          <div className={styles.contacts}>
            <p>Телефон: 8 (800) 222-59-38</p>
            <p>Email: info@krasrm.com</p>
            <p>г. Красноярск, ул. Красной Армии, 10</p>
            <p>Пн–Пт: 5:00–16:00 (МСК)</p>
          </div>
          <div className={styles.map}>
            <MapPlacement
              className='h-110'
              zoom={isMobile ? 16 : 17}
              lat={56.014468}
              lng={92.854937}
            />
          </div>
        </div>
      </div>

      {/* FORM */}
      <div id="contact" className={styles.section}>
        <div className={styles.container}>
          <Feedback />
        </div>
      </div>
    </main>
  )
}