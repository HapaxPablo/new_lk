'use client'
import { ModalWrapper } from '@/components/modal/ModalWrapper'
import { Button } from '@/components/ui/button/Button'
import { useModal } from '@/providers/modal/ModalProvider'
import { formatPrice } from '@/utils/nomenclatureUtils'
import { useEffect, useState } from 'react'

interface Discount {
  id: number
  days_from: number
  days_to: number
  coefficient: string
}

interface DiscountsResponse {
  results: Discount[]
}

interface DiscountCalculation {
  days: number
  coefficient: number
  base_price: number
  final_price: number
}

interface PriceTableButtonProps {
  nomenclatureId: string
}

export function PriceTableButton({ nomenclatureId }: PriceTableButtonProps) {
  const { isOpen, openModal } = useModal('priceTable', nomenclatureId)
  const [days, setDays] = useState(30)
  const [daysInput, setDaysInput] = useState('30')
  const [discounts, setDiscounts] = useState<Discount[]>([])
  const [calculation, setCalculation] = useState<DiscountCalculation | null>(
    null
  )
  const [isLoadingDiscounts, setIsLoadingDiscounts] = useState(false)
  const [isLoadingCalculation, setIsLoadingCalculation] = useState(false)
  const [error, setError] = useState('')

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    openModal()
  }

  useEffect(() => {
    if (!isOpen || discounts.length > 0) return

    const controller = new AbortController()

    async function loadDiscounts() {
      setIsLoadingDiscounts(true)
      setError('')

      try {
        const response = await fetch(
          `/api/nomenclatures/${nomenclatureId}/discounts`,
          { credentials: 'include', signal: controller.signal }
        )

        if (!response.ok) throw new Error('Не удалось загрузить скидки')

        const data: DiscountsResponse = await response.json()
        setDiscounts(data.results)
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return
        setError('Не удалось загрузить скидки. Попробуйте позже.')
      } finally {
        if (!controller.signal.aborted) setIsLoadingDiscounts(false)
      }
    }

    void loadDiscounts()

    return () => controller.abort()
  }, [discounts.length, isOpen, nomenclatureId])

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const value = Number(daysInput)

      if (Number.isInteger(value) && value > 0) setDays(value)
    }, 500)

    return () => window.clearTimeout(timeout)
  }, [daysInput])

  useEffect(() => {
    if (!isOpen) return

    const controller = new AbortController()
    async function calculate() {
      setIsLoadingCalculation(true)
      setError('')

      try {
        const response = await fetch(
          `/api/nomenclatures/${nomenclatureId}/discounts/calculate?days=${days}`,
          { credentials: 'include', signal: controller.signal }
        )

        if (!response.ok) throw new Error('Не удалось рассчитать стоимость')

        const data: DiscountCalculation = await response.json()
        setCalculation(data)
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return
        setError('Не удалось рассчитать стоимость. Попробуйте позже.')
      } finally {
        if (!controller.signal.aborted) setIsLoadingCalculation(false)
      }
    }

    void calculate()

    return () => {
      controller.abort()
    }
  }, [days, isOpen, nomenclatureId])

  return (
    <>
      <Button
        className="mt-4 p-8 !bg-[#e9f1fb] !font-bold !text-[#244b78]
                    transition-all duration-200 hover:-translate-y-1
                    hover:shadow-lg hover:underline"
        onClick={handleClick}
      >
        Смотреть все форматы и цены →
      </Button>

      <ModalWrapper
        id="priceTable"
        keyId={nomenclatureId}
        title="Стоимость размещения"
      >
        <div className="space-y-6">
          <label className="block text-sm font-bold text-slate-700">
            Количество дней
            <input
              type="number"
              min="1"
              step="1"
              value={daysInput}
              onChange={(event) => setDaysInput(event.target.value)}
              className="mt-2 block w-full rounded-lg border border-slate-300 px-3 py-2 text-base text-slate-900 outline-none transition focus:border-[#244b78] focus:ring-2 focus:ring-[#e9f1fb]"
            />
          </label>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-3 font-black">Срок размещения</th>
                  <th className="px-4 py-3 font-black">Коэффициент</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoadingDiscounts
                  ? Array.from({ length: 4 }, (_, index) => (
                      <tr key={index} className="animate-pulse">
                        <td className="px-4 py-3">
                          <div className="h-4 w-28 rounded bg-slate-100" />
                        </td>
                        <td className="px-4 py-3">
                          <div className="h-4 w-10 rounded bg-slate-100" />
                        </td>
                      </tr>
                    ))
                  : discounts.map((discount) => (
                      <tr key={discount.id}>
                        <td className="px-4 py-3">
                          {discount.days_from}–{discount.days_to} дней
                        </td>
                        <td className="px-4 py-3 font-bold">
                          ×{Number(discount.coefficient)}
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>

          <div className="relative overflow-x-auto rounded-xl border border-[#dce6f0]">
            {isLoadingCalculation && (
              <span
                className="absolute right-3 top-3 text-xs text-slate-500"
                aria-live="polite"
              >
                Рассчитываем...
              </span>
            )}
            <table className="w-full text-left text-sm">
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <th className="px-4 py-3 text-slate-600">Срок</th>
                  <td className="px-4 py-3 font-bold">
                    {calculation ? `${calculation.days} дней` : '—'}
                  </td>
                </tr>
                <tr>
                  <th className="px-4 py-3 text-slate-600">Базовая цена</th>
                  <td className="px-4 py-3 font-bold">
                    {calculation
                      ? formatPrice(String(calculation.base_price))
                      : '—'}
                  </td>
                </tr>
                <tr>
                  <th className="px-4 py-3 text-slate-600">Коэффициент</th>
                  <td className="px-4 py-3 font-bold">
                    {calculation ? `×${calculation.coefficient}` : '—'}
                  </td>
                </tr>
                <tr className="bg-[#e9f1fb]">
                  <th className="px-4 py-3 text-[#244b78]">
                    Итоговая стоимость за 1 день
                  </th>
                  <td className="px-4 py-3 text-lg font-black text-[#244b78]">
                    {calculation
                      ? formatPrice(String(calculation.final_price))
                      : '—'}
                  </td>
                </tr>
                <tr className="bg-[#244b78]">
                  <th className="px-4 py-3 text-white">
                    Итоговая стоимость за {calculation?.days ?? days} дней
                  </th>
                  <td className="px-4 py-3 text-lg font-black text-white">
                    {calculation
                      ? formatPrice(
                          String(
                            Math.ceil(
                              calculation.final_price * calculation.days
                            )
                          )
                        )
                      : '—'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
      </ModalWrapper>
    </>
  )
}
