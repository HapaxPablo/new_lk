interface StepsProps {
  cityName: string
}

export function Steps({ cityName }: StepsProps) {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-14">
        <div className="max-w-3xl">
          <div className="text-sm font-bold uppercase tracking-wider text-[#ef5350]">Как запустить</div>
          <h2 className="mt-2 text-3xl font-black text-slate-900">
            Как разместить рекламу в {cityName}
          </h2>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-4">
          <div className="rounded-3xl bg-slate-50 p-6 ring-1 ring-slate-200">
            <div className="text-4xl font-black text-[#ef5350]">01</div>
            <h3 className="mt-4 font-black">Выбор города</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">Выбираем {cityName} и подходящие рекламные площадки.</p>
          </div>
          <div className="rounded-3xl bg-slate-50 p-6 ring-1 ring-slate-200">
            <div className="text-4xl font-black text-[#ef5350]">02</div>
            <h3 className="mt-4 font-black">Подбор ТЦ</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">Собираем точки по бюджету, аудитории и району.</p>
          </div>
          <div className="rounded-3xl bg-slate-50 p-6 ring-1 ring-slate-200">
            <div className="text-4xl font-black text-[#ef5350]">03</div>
            <h3 className="mt-4 font-black">Подготовка ролика</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">Согласуем аудио, видео, сроки и частоту выхода.</p>
          </div>
          <div className="rounded-3xl bg-slate-50 p-6 ring-1 ring-slate-200">
            <div className="text-4xl font-black text-[#ef5350]">04</div>
            <h3 className="mt-4 font-black">Запуск</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">Размещаем рекламу и фиксируем параметры кампании.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
