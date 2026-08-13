import LoaderSkeleton from '@/components/ui/loader/LoaderSkeleton'
import { httpClient1CServer } from '@/lib/http-client/httpServer'
import { IGroupedTenantsResponse } from '@/types/tenants'
import { Metadata } from 'next'
import { cookies } from 'next/headers'
import dynamic from 'next/dynamic'
import { EcommerceTracker } from '@/components/ecommerce/EcommerceTracker'
import { SITE_URL } from '@/lib/configs/config-meta/configMetaData'
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd'
import BreadcrumbsSetter from '@/components/ui/breadcrumbs/BreadcrumbsSetter'
import Link from 'next/link'
import { TenantCatalogFilters } from '@/components/tenants/TenantCatalogFilters'
import { TenantFinderCard } from '@/components/tenants/TenantFinderCard'

const TenantsWrapper = dynamic(
  () =>
    import('@/components/tenants/TenantsWrapper').then((mod) => ({
      default: mod.TenantsWrapper,
    })),
  { ssr: true, loading: () => <LoaderSkeleton /> }
)

interface TenantsPageProps {
  searchParams: Promise<{
    limit?: string
    offset?: string
    search?: string
    category?: string
    city?: string
    sort?: string
  }>
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Арендаторы | Личный кабинет',
    description: 'Каталог арендаторов рекламных площадок',
  }
}

export default async function TenantsPage(props: TenantsPageProps) {
  const searchParams = await props.searchParams
  const limit = Number(searchParams.limit) || 15
  const offset = Number(searchParams.offset) || 0
  const search = searchParams.search || ''
  const category = searchParams.category || ''
  const city = searchParams.city || ''
  const sort = searchParams.sort || 'count_desc'

  try {
    const cookieStore = await cookies()
    const queryString = new URLSearchParams({
      limit: String(limit),
      offset: String(offset),
      ...(search && { search }),
      ...(category && { category }),
      ...(city && { city }),
      ...(sort && { sort }),
    }).toString()
    const data = await httpClient1CServer.get<IGroupedTenantsResponse>(
      cookieStore,
      `api/tenants/grouped/?${queryString}`
    )
    const breadcrumbItems = [
      { name: 'Главная', url: SITE_URL },
      { name: 'Арендаторы', url: `${SITE_URL}/tenants` },
    ]

    return (
      <>
        <EcommerceTracker
          item={{
            item_id: 'tenants-list',
            item_name: 'Список арендаторов',
            price: '',
          }}
        />
        <BreadcrumbJsonLd items={breadcrumbItems} />
        <BreadcrumbsSetter title="Арендаторы" />

        <div className="h-full overflow-y-auto bg-slate-50 text-slate-900">
          <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-[#18335f] to-[#ef5350]">
            <div className="absolute inset-0 opacity-15" aria-hidden="true">
              <div className="h-full w-full bg-[radial-gradient(circle_at_18%_15%,white,transparent_28%),radial-gradient(circle_at_90%_80%,white,transparent_32%)]" />
            </div>
            <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <div className="max-w-4xl">
                  <p className="inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-bold text-white ring-1 ring-white/20">
                    Справочник арендаторов рекламных площадок
                  </p>
                  <h1 className="mt-6 text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
                    Арендаторы торговых центров и мест размещения рекламы
                  </h1>
                  <p className="mt-6 max-w-3xl text-base leading-8 text-white/85 sm:text-lg">
                    Изучите арендаторов, которые представлены в торговых центрах
                    и indoor-площадках. Это помогает оценить аудиторию места,
                    выбрать подходящие точки размещения и запустить рекламу там,
                    где уже есть нужный покупательский поток.
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <a
                      href="#catalog"
                      className="rounded-xl bg-white px-6 py-3 text-sm font-black text-[#18335f]! shadow-lg transition hover:bg-slate-100"
                    >
                      Смотреть арендаторов
                    </a>
                    <Link
                      href="/nomenclatures"
                      className="rounded-xl border border-white/40 px-6 py-3 text-sm font-black text-white transition hover:bg-white/10 hover:text-white"
                    >
                      Подобрать площадки
                    </Link>
                  </div>
                </div>
                <div className="mt-10 grid max-w-5xl grid-cols-2 gap-3 md:grid-cols-4">
                  <HeroStat value={`${data.count}+`} label="арендаторов" />
                  <HeroStat value="551+" label="мест размещения" />
                  <HeroStat value="ТЦ" label="основная среда" />
                  <HeroStat value="B2C" label="покупательский трафик" />
                </div>
              </div>
              <TenantFinderCard />
            </div>
          </section>

          <section id="catalog" className="scroll-mt-4">
            <div className="mx-auto max-w-7xl px-4 py-14">
              <div className="max-w-3xl">
                <p className="text-sm font-bold uppercase tracking-wider text-[#ef5350]">
                  Каталог арендаторов
                </p>
                <h2 className="mt-2 text-3xl font-black text-slate-900">
                  Арендаторы в местах размещения рекламы
                </h2>
                <p className="mt-3 leading-7 text-slate-600">
                  Откройте карточку арендатора, чтобы посмотреть места
                  размещения, где он присутствует.
                </p>
              </div>
              <TenantCatalogFilters />
              <div className="mt-8 h-[48rem] min-h-[32rem] max-h-[70vh] min-w-0">
                <TenantsWrapper
                  tenantsData={data.results}
                  count={data.count}
                  limit={limit}
                />
              </div>
            </div>
          </section>

          <section className="bg-white">
            <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 lg:grid-cols-[0.8fr_1.2fr]">
              <div>
                <p className="text-sm font-bold uppercase tracking-wider text-[#ef5350]">
                  Аудитория площадок
                </p>
                <h2 className="mt-2 text-3xl font-black text-slate-900">
                  Арендаторы помогают понять, где размещать рекламу
                </h2>
              </div>
              <div className="space-y-4 leading-8 text-slate-600">
                <p>
                  Список арендаторов показывает, какие бренды, магазины и
                  сервисы присутствуют в местах размещения indoor-рекламы. По
                  ним можно понять профиль посетителей и покупательские сценарии
                  торгового центра.
                </p>
                <p>
                  Детские магазины указывают на семейную аудиторию, электроника
                  — на покупателей техники, а банки, одежда и косметика — на
                  регулярный розничный трафик.
                </p>
              </div>
            </div>
          </section>

          <section className="bg-slate-50">
            <div className="mx-auto max-w-7xl px-4 py-14">
              <p className="text-sm font-bold uppercase tracking-wider text-[#ef5350]">
                Категории
              </p>
              <h2 className="mt-2 text-3xl font-black text-slate-900">
                Какие арендаторы представлены в местах размещения
              </h2>
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <CategoryCard
                  emoji="👶"
                  title="Детские товары"
                  text="Арендаторы, которые формируют семейный покупательский поток."
                />
                <CategoryCard
                  emoji="📱"
                  title="Электроника"
                  text="Бренды техники и связи, привлекающие целевую аудиторию."
                />
                <CategoryCard
                  emoji="₽"
                  title="Финансы"
                  text="Банки, страхование и сервисы для массовой аудитории."
                />
                <CategoryCard
                  emoji="🛍"
                  title="Ритейл"
                  text="Одежда, косметика и товары регулярного спроса."
                />
              </div>
            </div>
          </section>

          <section className="bg-white">
            <div className="mx-auto max-w-7xl px-4 py-14">
              <div className="max-w-3xl">
                <p className="text-sm font-bold uppercase tracking-wider text-[#ef5350]">
                  Как использовать
                </p>
                <h2 className="mt-2 text-3xl font-black text-slate-900">
                  Как арендаторы помогают выбрать рекламную площадку
                </h2>
                <p className="mt-4 leading-7 text-slate-600">
                  Для рекламодателя важно понимать не только адрес торгового
                  центра, но и то, кто уже представлен внутри.
                </p>
              </div>
              <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <UseCaseCard
                  number="01"
                  title="Понимание аудитории"
                  text="Арендаторы показывают, какие покупатели чаще всего приходят в торговый центр."
                />
                <UseCaseCard
                  number="02"
                  title="Выбор подходящих ТЦ"
                  text="Можно выбрать площадки, где уже есть близкие по тематике или смежные бренды."
                />
                <UseCaseCard
                  number="03"
                  title="Точная реклама"
                  text="Реклама лучше работает, когда попадает в контекст интересов посетителей."
                />
                <UseCaseCard
                  number="04"
                  title="Больше заявок"
                  text="Понятная структура аудитории помогает быстрее выбрать место размещения."
                />
              </div>
            </div>
          </section>

          <section className="bg-[#ef5350]">
            <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 lg:grid-cols-[1fr_0.8fr] lg:items-center">
              <div>
                <h2 className="text-3xl font-black text-white">
                  Подберём рекламные площадки по арендаторам
                </h2>
                <p className="mt-3 max-w-3xl leading-7 text-white/85">
                  Расскажите, какая аудитория вам нужна — подберём торговые
                  центры и места размещения, где уже присутствуют подходящие
                  арендаторы.
                </p>
              </div>
              <div className="rounded-3xl bg-white p-5 shadow-xl">
                <p className="text-sm font-black text-slate-900">
                  Интересующая аудитория
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {[
                    'Семейная аудитория',
                    'Покупатели электроники',
                    'Финансовые услуги',
                    'Одежда и косметика',
                  ].map((audience) => (
                    <span
                      key={audience}
                      className="rounded-full bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700"
                    >
                      {audience}
                    </span>
                  ))}
                </div>
                <Link
                  href="/nomenclatures"
                  className="mt-5 inline-flex rounded-xl bg-[#18335f] px-5 py-3 text-sm font-black text-white transition hover:bg-[#12284c] hover:text-white"
                >
                  Получить подборку
                </Link>
              </div>
            </div>
          </section>

          <section className="bg-white">
            <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 lg:grid-cols-[0.8fr_1.2fr]">
              <div>
                <p className="text-sm font-bold uppercase tracking-wider text-[#ef5350]">
                  SEO-блок
                </p>
                <h2 className="mt-2 text-3xl font-black text-slate-900">
                  Арендаторы торговых центров и indoor-площадок
                </h2>
              </div>
              <div className="space-y-4 leading-8 text-slate-600">
                <p>
                  Раздел «Арендаторы» помогает рекламодателям выбрать места для
                  размещения indoor-рекламы с учётом состава магазинов, сервисов
                  и брендов внутри торговых центров. Наличие определённых
                  арендаторов позволяет оценить аудиторию площадки, её интересы
                  и покупательские сценарии.
                </p>
                <p>
                  В каталоге можно найти арендатора, посмотреть количество
                  площадок, где он присутствует, и перейти к подробной
                  информации. Это помогает подбирать рекламу не только по
                  адресу, но и по фактической аудитории торгового объекта.
                </p>
              </div>
            </div>
          </section>

          <section className="bg-slate-50">
            <div className="mx-auto max-w-7xl px-4 py-14">
              <p className="text-sm font-bold uppercase tracking-wider text-[#ef5350]">
                FAQ
              </p>
              <h2 className="mt-2 text-3xl font-black text-slate-900">
                Частые вопросы об арендаторах площадок
              </h2>
              <div className="mt-8 grid gap-4 lg:grid-cols-2">
                <FaqItem
                  open
                  question="Что показывает раздел арендаторов?"
                  answer="Раздел показывает бренды и магазины, которые присутствуют в местах размещения рекламы. Это помогает понять аудиторию площадок."
                />
                <FaqItem
                  question="Зачем рекламодателю смотреть арендаторов?"
                  answer="Состав арендаторов помогает оценить интересы посетителей торгового центра и выбрать площадку для рекламной кампании."
                />
                <FaqItem
                  question="Можно ли найти площадки по конкретному арендатору?"
                  answer="Да. Откройте карточку арендатора, чтобы увидеть места размещения, где он представлен."
                />
                <FaqItem
                  question="Арендаторы являются рекламными площадками?"
                  answer="Нет. Арендаторы помогают понять аудиторию торгового объекта, а рекламные площадки находятся внутри него."
                />
              </div>
            </div>
          </section>
        </div>
      </>
    )
  } catch (error) {
    console.error('Error fetching tenants:', error)
    throw error
  }
}

function HeroStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/15">
      <div className="text-2xl font-black text-white">{value}</div>
      <div className="mt-1 text-xs text-white/75">{label}</div>
    </div>
  )
}

function CategoryCard({
  emoji,
  title,
  text,
}: {
  emoji: string
  title: string
  text: string
}) {
  return (
    <article className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <span className="text-3xl" aria-hidden="true">
        {emoji}
      </span>
      <h3 className="mt-4 font-black text-slate-900">{title}</h3>
      <p className="mt-2 text-sm leading-7 text-slate-600">{text}</p>
    </article>
  )
}

function UseCaseCard({
  number,
  title,
  text,
}: {
  number: string
  title: string
  text: string
}) {
  return (
    <article className="rounded-3xl bg-slate-50 p-6 ring-1 ring-slate-200">
      <div className="text-4xl font-black text-[#ef5350]">{number}</div>
      <h3 className="mt-4 font-black text-slate-900">{title}</h3>
      <p className="mt-2 text-sm leading-7 text-slate-600">{text}</p>
    </article>
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
