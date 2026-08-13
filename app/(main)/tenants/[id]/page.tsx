import BreadcrumbsSetter from '@/components/ui/breadcrumbs/BreadcrumbsSetter'
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd'
import { EcommerceTracker } from '@/components/ecommerce/EcommerceTracker'
import ModalFeedBack from '@/components/nomenclatureById/modalFeedBack/ModalFeedBack'
import { httpClient1CServer } from '@/lib/http-client/httpServer'
import { SITE_URL } from '@/lib/configs/config-meta/configMetaData'
import { INomenclatureItem } from '@/types/nomenclature'
import {
  IGroupedTenant,
  IGroupedTenantsResponse,
  ITenantDetailResponse,
} from '@/types/tenants'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import { PlacesGrid } from './PlacesGrid'
import styles from './TenantDetail.module.scss'

interface TenantDetailPageProps {
  params: Promise<{
    id: string
  }>
}

const audienceCards = [
  [
    'Магазины и ритейл',
    'Одежда, обувь, аксессуары, товары для дома, подарки и повседневный спрос.',
  ],
  [
    'Красота и здоровье',
    'Салоны, косметика, медицинские центры, стоматологии и wellness-услуги.',
  ],
  [
    'Доставка и общепит',
    'Рестораны, кафе, доставка еды, кофейни и локальные акции.',
  ],
  [
    'Финансы и сервисы',
    'Банки, страхование, кредиты, образовательные и бытовые услуги.',
  ],
]

const launchSteps = [
  [
    '01',
    'Выберите аудиторию',
    'Определите, подходит ли вам посетительский поток торговых центров с этим арендатором.',
  ],
  ['02', 'Подберите ТЦ', 'Выберите одну или несколько площадок из списка.'],
  [
    '03',
    'Согласуйте ролик',
    'Подготовьте аудиоролик, текст акции или рекламное сообщение.',
  ],
  [
    '04',
    'Запустите рекламу',
    'Реклама выходит на выбранных indoor-площадках по согласованному графику.',
  ],
]

async function getTenantById(
  id: string
): Promise<ITenantDetailResponse | null> {
  try {
    const cookieStore = await cookies()

    return await httpClient1CServer.get<ITenantDetailResponse>(
      cookieStore,
      `api/tenants/${id}/`
    )
  } catch (error) {
    console.error('Error fetching tenant:', {
      error: error instanceof Error ? error.message : error,
      id,
      apiUrl: process.env.API_1C_URL,
    })

    if (error instanceof Error && error.message.includes('404')) {
      return null
    }

    throw error
  }
}

async function getNomenclatures(ids: string[]): Promise<INomenclatureItem[]> {
  if (!ids.length) return []

  const baseUrl = new URL('api/nomenclatures/bulk/', process.env.API_1C_URL)
  baseUrl.searchParams.set('ids', ids.join(','))

  try {
    const res = await fetch(baseUrl.toString(), { cache: 'no-store' })
    if (!res.ok) return []

    const data = await res.json()
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

async function getSimilarTenants(tenantId: string): Promise<IGroupedTenant[]> {
  try {
    const cookieStore = await cookies()
    const data = await httpClient1CServer.get<IGroupedTenantsResponse>(
      cookieStore,
      'api/tenants/grouped/?limit=5&offset=0'
    )

    return data.results
      .filter((tenant) => tenant.tenantId !== tenantId)
      .slice(0, 4)
  } catch {
    return []
  }
}

function getMinimumPrice(nomenclatures: INomenclatureItem[]) {
  const prices = nomenclatures
    .map((item) => Number(String(item.pricePerMonth).replace(',', '.')))
    .filter((price) => Number.isFinite(price) && price > 0)

  return prices.length ? Math.min(...prices) : null
}

function formatPrice(price: number | null) {
  if (price === null) return '—'

  return `от ${new Intl.NumberFormat('ru-RU', {
    maximumFractionDigits: 0,
  }).format(price)} ₽`
}

export async function generateMetadata(
  props: TenantDetailPageProps
): Promise<Metadata> {
  try {
    const { id } = await props.params
    const tenant = await getTenantById(id)
    const tenantName =
      tenant?.brand?.name || tenant?.tenantName || tenant?.keyword

    if (!tenant || !tenantName) {
      return {
        title: 'Арендатор не найден | Личный кабинет',
      }
    }

    const canonicalUrl = `${SITE_URL}/tenants/${id}`

    return {
      title: `${tenantName} | Арендаторы`,
      description: `Места размещения рекламы, где представлен арендатор «${tenantName}».`,
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title: `${tenantName} | Арендаторы`,
        description: `Места размещения рекламы, где представлен арендатор «${tenantName}».`,
        url: canonicalUrl,
        images: [`${SITE_URL}/og-logo.jpg`],
        locale: 'ru_RU',
        type: 'website',
      },
    }
  } catch (error) {
    console.error('Error generating tenant metadata:', error)
    return {
      title: 'Ошибка | Арендаторы',
    }
  }
}

export default async function TenantDetailPage(props: TenantDetailPageProps) {
  const { id } = await props.params
  const tenant = await getTenantById(id)

  if (!tenant) {
    notFound()
  }

  const nomenclatureIds = tenant.places.map((place) => place.nomenclatureId)
  const [nomenclatures, similarTenants] = await Promise.all([
    getNomenclatures(nomenclatureIds),
    getSimilarTenants(tenant.tenantId),
  ])

  const tenantName =
    tenant.brand?.name || tenant.tenantName || tenant.keyword || 'Арендатор'
  const cityCount = new Set(
    nomenclatures
      .map((place) => place.formattedAddress?.split(',')[0]?.trim())
      .filter(Boolean)
  ).size
  const minPrice = getMinimumPrice(nomenclatures)
  const breadcrumbItems = [
    { name: 'Главная', url: SITE_URL },
    { name: 'Арендаторы', url: `${SITE_URL}/tenants` },
    { name: tenantName, url: `${SITE_URL}/tenants/${id}` },
  ]

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <EcommerceTracker
        item={{
          item_id: tenant.tenantId,
          item_name: tenantName,
          item_category: 'Арендаторы',
          item_tenant: tenantName,
          price: '0',
        }}
      />
      <BreadcrumbsSetter title={tenantName} />

      <div
        className={`${styles.tenantPage} h-full overflow-y-auto bg-slate-50 text-slate-900`}
      >
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-[#18335f] to-[#ef5350]">
          <div className="absolute inset-0 opacity-10" aria-hidden="true">
            <div className="h-full w-full bg-[radial-gradient(circle_at_20%_20%,white,transparent_30%),radial-gradient(circle_at_80%_30%,white,transparent_25%),radial-gradient(circle_at_45%_90%,white,transparent_25%)]" />
          </div>

          <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div className="rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
              <div className="flex h-52 items-center justify-center rounded-3xl bg-gradient-to-br from-slate-50 to-orange-50 ring-1 ring-slate-200">
                {tenant.brand?.logotype ? (
                  <div className="relative h-full w-full">
                    <Image
                      src={tenant.brand.logotype}
                      alt={`Логотип ${tenantName}`}
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 480px"
                      className="object-contain p-6"
                    />
                  </div>
                ) : (
                  <div className="rounded-2xl bg-gradient-to-br from-orange-400 to-yellow-300 px-8 py-7 text-center shadow-inner">
                    <div className="text-2xl font-black uppercase tracking-wide text-white drop-shadow sm:text-3xl">
                      {tenantName}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3">
                <StatCard value={tenant.totalPlaces} label="места размещения" />
                <StatCard value={cityCount || '—'} label="городов" />
                <StatCard value={formatPrice(minPrice)} label="в день" />
              </div>
            </div>

            <div>
              <div className="mb-4 inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-bold text-white ring-1 ring-white/20">
                Арендатор в местах размещения рекламы
              </div>

              <h1 className="max-w-4xl text-4xl font-black leading-tight text-white md:text-5xl">
                Рекламные площадки, где присутствует «{tenantName}»
              </h1>

              <p className="mt-5 max-w-3xl text-lg leading-8 text-white/85">
                Арендатор «{tenantName}» представлен в торговых центрах, где
                доступно размещение indoor-рекламы. Это помогает рекламодателям
                оценить аудиторию площадок и выбрать места с подходящим
                покупательским потоком.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#places"
                  className="rounded-xl bg-white px-6 py-3 text-sm font-black text-[#18335f]! shadow-lg hover:bg-slate-100"
                >
                  Смотреть места размещения
                </a>
                <a
                  href="#brief"
                  className="rounded-xl border border-white/40 px-6 py-3 text-sm font-black text-white hover:bg-white/10"
                >
                  Подобрать площадки
                </a>
              </div>

              <div className="mt-8 grid max-w-4xl grid-cols-2 gap-3 md:grid-cols-4">
                <HeroFeature value="-" label="Категория" />
                <HeroFeature value="-" label="Места размещения" />
                <HeroFeature value="-" label="массовый трафик" />
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <div>
              <div className="text-sm font-bold uppercase tracking-wider text-[#ef5350]">
                Об арендаторе
              </div>
              <h2 className="mt-2 text-3xl font-black text-slate-900">
                Что означает присутствие арендатора в местах размещения
              </h2>
            </div>
            <div className="space-y-4 text-base leading-8 text-slate-600">
              <p>
                Страница показывает места размещения рекламы, где представлен «
                {tenantName}». Сам арендатор не является рекламной площадкой, но
                помогает понять, какой покупательский сценарий и аудитория
                характерны для объекта.
              </p>
              <p>
                Выберите интересующие площадки, чтобы собрать медиаплан,
                сравнить адреса и стоимость размещения, а затем отправить заявку
                на запуск рекламной кампании.
              </p>
            </div>
          </div>
        </section>

        <section className="border-y bg-slate-50">
          <div className="mx-auto max-w-7xl px-4 py-12">
            <div className="text-center">
              <div className="text-sm font-bold uppercase tracking-wider text-[#ef5350]">
                Почему это полезно
              </div>
              <h2 className="mt-2 text-3xl font-black text-slate-900">
                Почему арендаторы помогают выбрать площадку для рекламы
              </h2>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-4">
              <BenefitCard
                icon="🎯"
                title="Понимание аудитории"
                text="Арендатор подсказывает, кто приходит в торговый центр и какие интересы могут быть у посетителей."
                color="bg-[#ef5350]"
              />
              <BenefitCard
                icon="🛍️"
                title="Покупательский сценарий"
                text="Присутствие магазина помогает оценить контекст, в котором посетитель слышит или видит рекламу."
                color="bg-[#18335f]"
              />
              <BenefitCard
                icon="📍"
                title="Точнее подбор"
                text="Можно выбрать одну точку или собрать кампанию из нескольких площадок с подходящим трафиком."
                color="bg-slate-900"
              />
              <BenefitCard
                icon="📣"
                title="Реклама в контексте"
                text="Сообщение звучит или показывается рядом с потенциальными клиентами в момент выбора товаров и услуг."
                color="bg-violet-600"
              />
            </div>
          </div>
        </section>

        <section id="places" className="bg-white">
          <div className="mx-auto max-w-7xl px-4 py-14">
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="text-sm font-bold uppercase tracking-wider text-[#ef5350]">
                  Места размещения
                </div>
                <h2 className="mt-2 text-3xl font-black text-slate-900">
                  Где присутствует «{tenantName}»
                </h2>
                <p className="mt-3 max-w-3xl text-slate-600">
                  Выберите площадки с адресами и стоимостью, чтобы добавить их в
                  заказ и получить медиаплан.
                </p>
              </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
              <div className="rounded-3xl bg-slate-50 p-4 ring-1 ring-slate-200 md:p-6">
                <div className="mb-5 flex flex-wrap gap-2 text-xs font-bold text-slate-600">
                  <span className="rounded-full bg-white px-3 py-2 ring-1 ring-slate-200">
                    Все города
                  </span>
                  <span className="rounded-full bg-white px-3 py-2 ring-1 ring-slate-200">
                    Торговые центры
                  </span>
                  <span className="rounded-full bg-white px-3 py-2 ring-1 ring-slate-200">
                    Indoor-реклама
                  </span>
                </div>
                <PlacesGrid
                  places={tenant.places}
                  nomenclatures={nomenclatures}
                />
              </div>

              <aside className="space-y-4">
                <div className="rounded-3xl bg-[#18335f] p-6 text-white shadow-sm">
                  <h3 className="text-xl font-black">Быстрая заявка</h3>
                  <p className="mt-2 text-sm leading-7 text-white/75">
                    Подскажем, какие площадки с этим арендатором лучше подойдут
                    под вашу задачу и бюджет.
                  </p>
                  <div className="mt-5">
                    <ModalFeedBack
                      pathName="tenants"
                      nomenclaturesIds={nomenclatureIds}
                    />
                  </div>
                </div>

                <div className="rounded-3xl bg-gradient-to-br from-orange-50 to-rose-50 p-6 ring-1 ring-orange-100">
                  <div className="text-sm font-bold uppercase tracking-wider text-[#ef5350]">
                    Карта присутствия
                  </div>
                  <div className="mt-3 text-4xl font-black text-[#18335f]!">
                    {tenant.totalPlaces}
                  </div>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    {tenant.totalPlaces === 1
                      ? 'площадка с этим арендатором'
                      : 'площадок с этим арендатором'}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {Array.from(
                      new Set(
                        nomenclatures
                          .map((place) =>
                            place.formattedAddress?.split(',')[0]?.trim()
                          )
                          .filter(Boolean)
                      )
                    )
                      .slice(0, 5)
                      .map((city) => (
                        <span
                          key={city}
                          className="rounded-full bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-sm ring-1 ring-slate-200"
                        >
                          {city}
                        </span>
                      ))}
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>

        <section className="bg-white">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <div className="text-sm font-bold uppercase tracking-wider text-[#ef5350]">
                Аудитория
              </div>
              <h2 className="mt-2 text-3xl font-black text-slate-900">
                Каким рекламодателям подходят площадки с этим арендатором
              </h2>
              <p className="mt-4 leading-8 text-slate-600">
                Площадки с заметным розничным трафиком могут быть интересны
                бизнесам, которые работают с массовой и семейной аудиторией.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {audienceCards.map(([title, text]) => (
                <div
                  key={title}
                  className="rounded-3xl bg-slate-50 p-6 ring-1 ring-slate-200"
                >
                  <h3 className="font-black text-slate-900">{title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-slate-900 text-white">
          <div className="mx-auto max-w-7xl px-4 py-14">
            <div className="max-w-3xl">
              <div className="text-sm font-bold uppercase tracking-wider text-[#ffb0ae]">
                Как запустить
              </div>
              <h2 className="mt-2 text-3xl font-black">
                Как разместить рекламу на площадках с этим арендатором
              </h2>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-4">
              {launchSteps.map(([number, title, text]) => (
                <div
                  key={number}
                  className="rounded-3xl bg-white/10 p-6 ring-1 ring-white/10"
                >
                  <div className="text-4xl font-black text-[#ffb0ae]">
                    {number}
                  </div>
                  <h3 className="mt-4 font-black">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/70">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="brief" className="bg-[#ef5350]">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <h2 className="text-3xl font-black text-white">
                Подберём площадки с нужными арендаторами
              </h2>
              <p className="mt-3 max-w-3xl text-white/85">
                Оставьте заявку — покажем, в каких торговых центрах представлен
                «{tenantName}», и предложим подходящие места для рекламы.
              </p>
            </div>
            <div className="rounded-3xl bg-white p-5 shadow-xl">
              <ModalFeedBack
                pathName="tenants"
                nomenclaturesIds={nomenclatureIds}
              />
            </div>
          </div>
        </section>

        {similarTenants.length > 0 && (
          <section className="bg-slate-50">
            <div className="mx-auto max-w-7xl px-4 py-14">
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <div className="text-sm font-bold uppercase tracking-wider text-[#ef5350]">
                    Похожие арендаторы
                  </div>
                  <h2 className="mt-2 text-3xl font-black text-slate-900">
                    Другие арендаторы в местах размещения
                  </h2>
                </div>
                <Link
                  href="/tenants"
                  className="text-sm font-black text-[#ef5350] hover:text-[#d83c39]"
                >
                  Все арендаторы →
                </Link>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {similarTenants.map((similarTenant) => (
                  <Link
                    key={similarTenant.tenantId}
                    href={`/tenants/${similarTenant.tenantId}`}
                    className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200 transition hover:ring-[#ef5350]"
                  >
                    <div className="relative flex h-28 items-center justify-center overflow-hidden rounded-2xl bg-slate-50">
                      {similarTenant.brandLogotype ? (
                        <Image
                          src={similarTenant.brandLogotype}
                          alt={similarTenant.brandName}
                          fill
                          className="object-contain p-3"
                          sizes="250px"
                        />
                      ) : (
                        <span className="px-3 text-center text-lg font-black text-slate-400">
                          {similarTenant.brandName}
                        </span>
                      )}
                    </div>
                    <h3 className="mt-4 font-black text-slate-900">
                      {similarTenant.brandName}
                    </h3>
                    <p className="mt-2 text-sm text-slate-500">
                      {similarTenant.count} мест размещения
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="bg-white">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 lg:grid-cols-[0.75fr_1.25fr]">
            <div>
              <div className="text-sm font-bold uppercase tracking-wider text-[#ef5350]">
                О площадках
              </div>
              <h2 className="mt-2 text-3xl font-black text-slate-900">
                Места размещения рекламы, где присутствует «{tenantName}»
              </h2>
            </div>
            <div className="text-base leading-8 text-slate-600">
              <p>
                Страница арендатора помогает рекламодателям оценить профиль
                аудитории объекта, понять потребительский сценарий посетителей и
                выбрать подходящие точки для размещения аудио- или видеорекламы.
              </p>
              <p className="mt-4">
                Пользователь может выбрать конкретную площадку, посмотреть
                адрес, стоимость размещения и отправить заявку на запуск
                рекламной кампании.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-slate-50">
          <div className="mx-auto max-w-7xl px-4 py-14">
            <div className="max-w-3xl">
              <div className="text-sm font-bold uppercase tracking-wider text-[#ef5350]">
                FAQ
              </div>
              <h2 className="mt-2 text-3xl font-black text-slate-900">
                Частые вопросы о размещении рекламы рядом с этим арендатором
              </h2>
            </div>

            <div className="mt-8 grid gap-4 lg:grid-cols-2">
              <FaqItem
                open
                question="Что означает страница арендатора?"
                answer="Она показывает, в каких местах размещения рекламы присутствует конкретный арендатор. Сам арендатор не является рекламной площадкой, но помогает оценить аудиторию объекта."
              />
              <FaqItem
                question={`Где присутствует «${tenantName}»?`}
                answer="Актуальный список площадок с адресами и стоимостью размещения представлен выше на странице."
              />
              <FaqItem
                question="Зачем рекламодателю смотреть арендаторов?"
                answer="По арендаторам можно понять профиль аудитории торгового центра и выбрать площадку, где рекламное сообщение будет ближе к интересам посетителей."
              />
              <FaqItem
                question="Можно ли выбрать несколько площадок сразу?"
                answer="Да, можно добавить несколько площадок в заказ и собрать медиаплан для размещения indoor-рекламы."
              />
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

function StatCard({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-3 text-center ring-1 ring-slate-200 sm:p-4">
      <div className="text-lg font-black text-[#ef5350] sm:text-2xl">
        {value}
      </div>
      <div className="mt-1 text-xs font-semibold leading-4 text-slate-500">
        {label}
      </div>
    </div>
  )
}

function HeroFeature({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/15">
      <div className="text-lg font-black text-white sm:text-2xl">{value}</div>
      <div className="mt-1 text-xs text-white/75">{label}</div>
    </div>
  )
}

function BenefitCard({
  icon,
  title,
  text,
  color,
}: {
  icon: string
  title: string
  text: string
  color: string
}) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <div
        className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl text-xl text-white ${color}`}
      >
        {icon}
      </div>
      <h3 className="font-black text-slate-900">{title}</h3>
      <p className="mt-2 text-sm leading-7 text-slate-600">{text}</p>
    </div>
  )
}

function FaqItem({
  question,
  answer,
  open = false,
}: {
  question: string
  answer: string
  open?: boolean
}) {
  return (
    <details
      open={open}
      className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200"
    >
      <summary className="cursor-pointer font-black text-slate-900">
        {question}
      </summary>
      <p className="mt-3 text-sm leading-7 text-slate-600">{answer}</p>
    </details>
  )
}
