'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FileText, Import, ListMusic, Plus, Radio } from 'lucide-react'
import OrdersTable from './components/Orderstable'

export default function Page() {
  const [type, setType] = useState<'ad' | 'bg'>('ad')

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <div className="rounded-3xl bg-slate-900 px-5 py-6 text-white shadow-sm sm:px-8 sm:py-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium text-blue-200">
              Управление вещанием
            </p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
              Заказы
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
              Создавайте заказы, подбирайте контент и следите за их статусом в
              одном месте.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link
              href="/orders/ad/create"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-900! transition hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-900"
            >
              <Plus size={17} /> Создать рекламу
            </Link>
            <Link
              href="/orders/bg/create"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-600 px-4 py-2.5 text-sm font-semibold text-white! transition hover:border-slate-400 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-white"
            >
              <Plus size={17} /> Создать фоновый заказ
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Link
          href="/orders/files"
          className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
        >
          <div className="flex items-start gap-4">
            <span className="rounded-xl bg-blue-50 p-3 text-blue-700">
              <Import size={22} />
            </span>
            <div>
              <h2 className="font-semibold text-slate-900">Файлы</h2>
              <p className="mt-1 text-sm leading-5 text-slate-500">
                Загрузите контент или соберите из него новый плейлист.
              </p>
            </div>
          </div>
        </Link>
        <Link
          href="/orders/playlists"
          className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
        >
          <div className="flex items-start gap-4">
            <span className="rounded-xl bg-violet-50 p-3 text-violet-700">
              <ListMusic size={22} />
            </span>
            <div>
              <h2 className="font-semibold text-slate-900">Плейлисты</h2>
              <p className="mt-1 text-sm leading-5 text-slate-500">
                Проверьте состав плейлистов перед запуском в эфир.
              </p>
            </div>
          </div>
        </Link>
      </div>

      <section className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-5 sm:px-6 sm:py-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Список заказов</h2>
            <p className="mt-1 text-sm text-slate-500">
              Выберите заказ, чтобы открыть детали и доступные действия.
            </p>
          </div>
          <div
            className="inline-flex w-full rounded-xl bg-slate-100 p-1 sm:w-auto"
            role="tablist"
            aria-label="Тип заказа"
          >
            <button
              type="button"
              role="tab"
              aria-selected={type === 'ad'}
              onClick={() => setType('ad')}
              className={`flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition sm:flex-none ${type === 'ad' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Реклама
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={type === 'bg'}
              onClick={() => setType('bg')}
              className={`flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition sm:flex-none ${type === 'bg' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Фоновый контент
            </button>
          </div>
        </div>
        <OrdersTable type={type} />
      </section>
    </div>
  )
}
