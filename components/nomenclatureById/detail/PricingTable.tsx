// components/nomenclatureById/detail/PricingTable.tsx
import { formatPrice } from '@/utils/nomenclatureUtils'

interface PricingTableProps {
  pricePerDay?: string
}

interface Tariff {
  label: string
  period: string
  monthlyPrice: number
  note: string
}

export function PricingTable({ pricePerDay }: PricingTableProps) {
  const daily = pricePerDay ? parseFloat(pricePerDay) : 0

  if (!daily || Number.isNaN(daily)) {
    return (
      <p className="mt-4 text-sm text-slate-500">
        Стоимость размещения уточняйте у ответственного менеджера.
      </p>
    )
  }

  const monthly = daily * 30

  const tariffs: Tariff[] = [
    {
      label: 'Тариф 1',
      period: '1 месяц',
      monthlyPrice: monthly,
      note: 'Базовая стоимость',
    },
    {
      label: 'Тариф 2',
      period: '3 месяца',
      monthlyPrice: monthly * 0.9,
      note: 'Скидка 10% при оплате за 3 месяца',
    },
    {
      label: 'Тариф 3',
      period: '6 месяцев',
      monthlyPrice: monthly * 0.85,
      note: 'Скидка 15% для долгосрочного размещения',
    },
    {
      label: 'Тариф 4',
      period: '1 год',
      monthlyPrice: monthly * 0.75,
      note: 'Максимальная скидка 25% в год',
    },
  ]

  return (
    <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-slate-500">
          <tr>
            <th className="px-4 py-3 font-black">Тариф</th>
            <th className="px-4 py-3 font-black">Период</th>
            <th className="px-4 py-3 font-black">Стоимость</th>
            <th className="px-4 py-3 font-black">Комментарий</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {tariffs.map((tariff) => (
            <tr key={tariff.period}>
              <td className="px-4 py-3 font-bold">{tariff.label}</td>
              <td className="px-4 py-3">{tariff.period}</td>
              <td className="px-4 py-3 font-black text-[#ef5350]">
                {formatPrice(String(Math.round(tariff.monthlyPrice)))}/мес
              </td>
              <td className="px-4 py-3 text-slate-500">{tariff.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
