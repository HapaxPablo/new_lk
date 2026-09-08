import { EntityCard } from '@/components/ui/card/EntityCard'
import { type PopularCity } from '@/lib/api/geocoding'

interface NomenclaturesLandingSectionsProps {
  totalItems: number
  popularCities: PopularCity[]
}

export function NomenclaturesLandingSections({
  totalItems,
  popularCities,
}: NomenclaturesLandingSectionsProps) {
  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-[#18335f] to-[#ef5350]">
        <div className="absolute inset-0 opacity-10 [background-image:radial-gradient(circle_at_20%_20%,white,transparent_30%),radial-gradient(circle_at_80%_30%,white,transparent_25%),radial-gradient(circle_at_40%_90%,white,transparent_25%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <p className="inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/20">
              Indoor-реклама в торговых центрах и магазинах
            </p>
            <h1 className="mt-5 max-w-4xl text-4xl font-black leading-tight text-white md:text-5xl">
              Подберите площадки для аудио- и видеорекламы
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-white/85">
              Сравнивайте рекламные площадки по городу, адресу и типу
              размещения. Соберём медиаплан под ваш бюджет и задачу.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#catalog"
                className="rounded-xl bg-white px-6 py-3 text-sm font-bold text-[#18335f]! shadow-lg hover:bg-slate-100"
              >
                Смотреть площадки
              </a>
              <a
                href="#brief"
                className="rounded-xl border border-white/40 px-6 py-3 text-sm font-bold text-white hover:bg-white/10 hover:text-white!"
              >
                Получить подборку
              </a>
            </div>
            <div className="mt-8 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
              <EntityCard tone="inverted" className="rounded-2xl p-4">
                <div className="text-2xl font-black text-white">
                  {totalItems}+
                </div>
                <div className="mt-1 text-xs text-white/75">
                  площадок в каталоге
                </div>
              </EntityCard>
              <EntityCard tone="inverted" className="rounded-2xl p-4">
                <div className="text-2xl font-black text-white">Аудио</div>
                <div className="mt-1 text-xs text-white/75">реклама в ТЦ</div>
              </EntityCard>
              <EntityCard tone="inverted" className="rounded-2xl p-4">
                <div className="text-2xl font-black text-white">Видео</div>
                <div className="mt-1 text-xs text-white/75">
                  экраны и digital
                </div>
              </EntityCard>
              <EntityCard tone="inverted" className="rounded-2xl p-4">
                <div className="text-2xl font-black text-white">7 дней</div>
                <div className="mt-1 text-xs text-white/75">быстрый запуск</div>
              </EntityCard>
            </div>
          </div>

          <EntityCard className="p-6 shadow-2xl">
            <p className="text-xl font-black text-slate-900">Быстрый старт</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Выберите подходящие точки в каталоге или оставьте заявку —
              менеджер подготовит подборку.
            </p>
            <a
              href="#catalog"
              className="mt-6 block rounded-xl bg-[#ef5350] px-5 py-3 text-center text-sm font-black text-white shadow-md hover:bg-[#e14442] hover:text-white!"
            >
              Перейти к каталогу
            </a>
            <p className="mt-4 text-center text-xs text-slate-400">
              Консультируем по выбору формата, срокам и бюджету.
            </p>
          </EntityCard>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-[#ef5350]">
                Реклама в местах продаж
              </p>
              <h2 className="mt-2 text-3xl font-black text-slate-900">
                Площадки для рекламы с понятными условиями размещения
              </h2>
            </div>
            <div className="space-y-4 leading-8 text-slate-600">
              <p>
                Каталог помогает выбрать точки для indoor-рекламы: торговые
                центры, магазины и другие площадки с постоянным потоком
                посетителей.
              </p>
              <p>
                Используйте поиск и фильтры, чтобы сравнить адреса, форматы и
                стоимость, а затем добавьте нужные площадки в медиаплан.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-14">
          <p className="text-sm font-bold uppercase tracking-wider text-[#ef5350]">
            География размещения
          </p>
          <h2 className="mt-2 text-3xl font-black text-slate-900">
            Популярные города
          </h2>
          <div className="mt-7 flex flex-wrap gap-3">
            {popularCities.map((city) => (
              <a
                key={city.id}
                href={`/places/${encodeURIComponent(city.slug)}`}
                target='_blank'
                className="rounded-full bg-white px-5 py-3 text-sm font-bold text-[#18335f]! shadow-sm ring-1 ring-slate-200 hover:bg-[#18335f] hover:text-white!"
              >
                {city.name}
                <span className="ml-1 text-slate-400">
                  ({city.nomenclature_count})
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export function NomenclaturesSeoSections() {
  return (
    <>
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14">
          <p className="text-sm font-bold uppercase tracking-wider text-[#ef5350]">
            Форматы размещения
          </p>
          <h2 className="mt-2 text-3xl font-black text-slate-900">
            Какие виды рекламы доступны
          </h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {[
              [
                '▶',
                'Аудиореклама',
                'Рекламные аудиоролики звучат в местах с высоким потоком посетителей.',
              ],
              [
                '▣',
                'Видеореклама',
                'Видеоролики на indoor-экранах помогают наглядно рассказать об акции или бренде.',
              ],
              [
                '★',
                'Комплексное размещение',
                'Объединяйте несколько площадок и форматов, чтобы увеличить охват.',
              ],
            ].map(([icon, title, text], index) => (
              <EntityCard key={title} tone="muted" className="p-6">
                <div
                  className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl text-xl text-white ${index === 0 ? 'bg-[#ef5350]' : index === 1 ? 'bg-[#18335f]' : 'bg-slate-900'}`}
                >
                  {icon}
                </div>
                <h3 className="text-xl font-black text-slate-900">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{text}</p>
              </EntityCard>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-900 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-[#ffb0ae]">
              Преимущества
            </p>
            <h2 className="mt-2 text-3xl font-black">
              Почему indoor-реклама работает
            </h2>
            <p className="mt-4 leading-8 text-white/70">
              Посетители торговых центров и магазинов уже находятся в
              потребительском сценарии и готовы реагировать на понятные
              предложения.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              'Локальный охват',
              'Повторные контакты',
              'Быстрый запуск',
              'Гибкий бюджет',
            ].map((title) => (
              <EntityCard key={title} tone="inverted" className="p-6">
                <h3 className="font-black">{title}</h3>
                <p className="mt-2 text-sm leading-7 text-white/70">
                  Подбирайте площадки под конкретный город, аудиторию и цели
                  кампании.
                </p>
              </EntityCard>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-wider text-[#ef5350]">
              Для кого
            </p>
            <h2 className="mt-2 text-3xl font-black text-slate-900">
              Кому подходит размещение indoor-рекламы
            </h2>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-4">
            {[
              'Ритейл и магазины',
              'Медицина и услуги',
              'Банки и финансы',
              'Недвижимость',
            ].map((title) => (
              <EntityCard key={title} className="rounded-2xl p-5">
                <h3 className="font-black text-slate-900">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Акции, открытие новых точек и продвижение локальных
                  предложений.
                </p>
              </EntityCard>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-14">
          <p className="text-sm font-bold uppercase tracking-wider text-[#ef5350]">
            Как запустить кампанию
          </p>
          <h2 className="mt-2 text-3xl font-black text-slate-900">
            Четыре шага до размещения
          </h2>
          <div className="mt-8 grid gap-5 md:grid-cols-4">
            {[
              'Выберите город',
              'Подберите площадки',
              'Согласуйте медиаплан',
              'Запустите рекламу',
            ].map((title, index) => (
              <EntityCard key={title} tone="muted" className="p-6">
                <div className="text-4xl font-black text-[#ef5350]">
                  0{index + 1}
                </div>
                <h3 className="mt-4 font-black text-slate-900">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Менеджер поможет на каждом этапе и рассчитает стоимость.
                </p>
              </EntityCard>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#ef5350]">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <h2 className="text-3xl font-black text-white">
              Получите медиаплан для вашей рекламной кампании
            </h2>
            <p className="mt-3 max-w-3xl text-white/85">
              Расскажите о задаче, бюджете и сроках — подготовим список
              подходящих площадок.
            </p>
          </div>
          <a
            href="#brief"
            className="rounded-xl bg-white px-7 py-4 text-center text-sm font-black text-slate-900! shadow-lg hover:bg-slate-100"
          >
            Получить медиаплан
          </a>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-[#ef5350]">
              О размещении
            </p>
            <h2 className="mt-2 text-3xl font-black text-slate-900">
              Реклама в торговых центрах и магазинах
            </h2>
          </div>
          <div className="space-y-4 leading-8 text-slate-600">
            <p>
              Indoor-реклама помогает обратиться к аудитории внутри торговых
              центров, супермаркетов и других коммерческих объектов с постоянным
              потоком посетителей.
            </p>
            <p>
              На странице собраны площадки с адресами, форматами и стоимостью.
              Каталог упрощает выбор точек и подготовку рекламной кампании.
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
            Частые вопросы
          </h2>
          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            {[
              [
                'Где можно разместить рекламу?',
                'В торговых центрах, магазинах и других indoor-площадках из каталога.',
              ],
              [
                'Какие форматы доступны?',
                'Аудиоролики, видеоролики на экранах и комплексные размещения.',
              ],
              [
                'От чего зависит стоимость?',
                'От выбранных площадок, длительности кампании, частоты выходов и формата.',
              ],
              [
                'Можно ли собрать несколько точек?',
                'Да, добавьте площадки в медиаплан или оставьте заявку на подборку.',
              ],
            ].map(([question, answer]) => (
              <EntityCard as="details" key={question} className="p-5">
                <summary className="cursor-pointer font-black text-slate-900">
                  {question}
                </summary>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {answer}
                </p>
              </EntityCard>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
