import type { Metadata } from 'next'
import { Users, Target, Radio, Cpu } from 'lucide-react'
import Feedback from '@/components/ui/forms/feedback/Feedback'
import styles from './About.module.scss'
import { MapPlacement } from '@/components/nomenclatureById'
import { Button } from '@/components/ui/button/Button'
import ContactButton from './ContactButton'
import { headers } from 'next/headers'
import { SITE_URL } from '@/lib/configs/config-meta/configMetaData'
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd'
import BreadcrumbsSetter from '@/components/ui/breadcrumbs/BreadcrumbsSetter'

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
  const breadcrumbItems = [
    { name: 'Главная', url: `${SITE_URL}` },
    { name: 'О компании', url: `${SITE_URL}/about` },
  ]
  return (
    <>

      <main className={styles.page}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* HERO */}
        <BreadcrumbJsonLd items={breadcrumbItems} />
        <BreadcrumbsSetter title="О нас" />
        <div className={styles.hero}>
          <div className={styles.container}>
            <h1 className={styles.title}>Indoor-реклама, которая продаёт</h1>
            <p className={styles.subtitle}>
              Размещаем рекламу в супермаркетах и ТЦ по всей России
            </p>
            <ContactButton />
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
              <ContactButton />
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
            <div className={styles.grid2_row}>
              <div className='flex flex-row gap-4'>
                <div className='flex flex-col text-pretty'>
                  <div>Реквизиты:</div>
                  <div>ООО «АРЭМСИ 24»</div>
                  <div>ИНН 2466158759 КПП 246601001</div>
                  <div>Юр. адрес 660017 г. Красноярск, ул. Красной Армии, 10, стр.3, оф.2-01</div>
                  <div>Р/с 40702810923000000420</div>
                  <div>К/с 30101810600000000774</div>
                  <div>Банк Филиал «Новосибирский» АО «Альфа-Банк»</div>
                  <div>БИК 045004774</div>

                </div>
                {/* <div>
                ОКВЭД:
                <ul className='list-disc list-inside text-pretty'>
                  <li>62,01 Разработка компьютерного программного обеспечения</li>
                  <li>60.10 Деятельность в области радиовещания</li>
                  <li>59.20 Деятельность в области звукозаписи и издания музыкальных произведений</li>
                  <li>60.20 Деятельность в области телевизионного вещания</li>
                  <li>61.10 Деятельность в области связи на базе проводных технологий</li>
                  <li>62.03 Деятельность по управлению компьютерным оборудованием</li>
                  <li>62.09 Деятельность, связанная с использованием вычислительной техники и информационных технологий, прочая</li>
                  <li>63.11 Деятельность по обработке данных, предоставление услуг по размещению информации и связанная с этим деятельность</li>
                </ul>
              </div> */}

              </div>
              <div className='w-full flex justify-center text-xl font-semibold text-pretty'>
                «АРЭМСИ 24» зарегистрирована в реестре аккредитованных IT-компаний, начиная с 19.05.2022 г.
              </div>
              {/* <div>
              <div className='text-xl font-semibold'>Технологический стек АРЭМСИ24:</div>
              <ul className='list-disc list-inside text-pretty'>
                <li>
                  Frontend: React, Next.js, TypeScript, Tailwind CSS
                </li>
                <li>
                  Backend: Django, Django REST Framework, PostgreSQL
                </li>
                <li>
                  DevOps: Docker, GitLab локальный, CI/CD, Nginx
                </li>
                <li>
                  1c: Предприятие 8.3 (Управление торговлей, Бухгалтерия, Зарплата и тд) + интеграция с API нашего ПО
                </li>
              </ul>
              <div className='text-xl font-semibold'>Стек АРЭМСИ24 Content Player:</div>
              <ul className='list-disc list-inside text-pretty'>
                <li>Python 3.14 + PyQt6 (GUI) + VLC (медиа) + SQLite (БД) + aiohttp (API)</li>
                <li>Windows: pycaw/comtypes (звук) | Linux: alsaaudio/PulseAudio</li>
                <li>Сборка: PyInstaller (EXE)</li>
              </ul>
            </div> */}
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
      </main >
    </>
  )
}