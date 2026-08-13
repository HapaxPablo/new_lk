'use client'

import { SearchForm } from '@/components/search-form/SearchForm'

interface ToolbarTenantsProps {
  totalItems: number
}

const ToolbarTenants = ({ totalItems }: ToolbarTenantsProps) => (
  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
    <div className="shrink-0 text-sm font-bold text-slate-600">
      Всего арендаторов: <span className="text-[#ef5350]">{totalItems}</span>
    </div>
    <div className="flex-1">
      <SearchForm
        hideButton
        className="w-full"
        inputClassName="rounded-xl border-slate-200 bg-slate-50 py-3 text-slate-900 placeholder:text-slate-400 focus:border-[#ef5350] focus:ring-[#ef5350]/20"
        placeholder="Введите бренд, арендатора или код 1С"
      />
    </div>
  </div>
)

export default ToolbarTenants
