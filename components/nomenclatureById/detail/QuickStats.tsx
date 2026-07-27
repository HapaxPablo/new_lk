// components/nomenclatureById/detail/QuickStats.tsx
import { formatPossibility } from '@/utils/nomenclatureUtils'

interface QuickStatsProps {
  possibility?: string
  contentType?: string
}

export function QuickStats({ possibility, contentType }: QuickStatsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <div className="text-sm font-bold text-slate-400">Проходимость</div>
        <div className="mt-2 text-2xl font-black text-slate-900">
          {possibility ? formatPossibility(possibility) : 'Уточняется'}
        </div>
        <div className="mt-1 text-sm text-slate-500">посетителей в месяц</div>
      </div>

      <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <div className="text-sm font-bold text-slate-400">Формат</div>
        <div className="mt-2 text-2xl font-black text-slate-900">
          {contentType || '—'}
        </div>
        <div className="mt-1 text-sm text-slate-500">тип рекламы</div>
      </div>

      <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <div className="text-sm font-bold text-slate-400">Запуск</div>
        <div className="mt-2 text-2xl font-black text-slate-900">от 3 дней</div>
        <div className="mt-1 text-sm text-slate-500">после согласования</div>
      </div>
    </div>
  )
}
