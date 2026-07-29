import Link from 'next/link'
import { ReactNode } from 'react'
import { ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button/Button'

interface OrderFormShellProps {
  title: string
  description?: string
  children: ReactNode
  isSubmitting: boolean
  onCancel: () => void
  onSubmit: () => void
}

export function OrderFormShell({
  title,
  description,
  children,
  isSubmitting,
  onCancel,
  onSubmit,
}: OrderFormShellProps) {
  return (
    <div className="flex h-full w-full flex-col overflow-y-auto bg-slate-50">
      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-6 sm:px-6 sm:py-10 lg:max-w-6xl lg:px-10">
        <Link
          href="/orders"
          className="inline-flex w-fit items-center gap-1 text-sm font-medium text-slate-500 hover:text-slate-700"
        >
          <ChevronLeft size={16} />
          Назад к заказам
        </Link>

        <div className="mt-4 mb-6 sm:mb-8">
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            {title}
          </h1>
          {description && (
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              {description}
            </p>
          )}
        </div>

        <div className="flex flex-1 flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
          <div className="grid gap-6 overflow-y-auto p-5 sm:gap-8 sm:p-8 lg:p-10">
            {children}
          </div>

          <div className="mt-auto flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50/60 px-5 py-5 sm:flex-row sm:justify-end sm:px-8 lg:px-10">
            <Button
              variant="default"
              onClick={onCancel}
              fullWidth
              className="sm:w-auto"
            >
              Отменить
            </Button>
            <Button
              onClick={onSubmit}
              isLoading={isSubmitting}
              fullWidth
              className="sm:w-auto"
            >
              Создать заказ
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
