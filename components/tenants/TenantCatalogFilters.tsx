'use client'

import {
  setTenantFilterParams,
  TENANT_CATEGORIES,
  TENANT_CITIES,
  TENANT_QUICK_CATEGORIES,
  TENANT_SORTS,
} from '@/lib/tenants/filters'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { FormEvent, useEffect, useState } from 'react'
import styles from './TenantCatalogFilters.module.scss'

export function TenantCatalogFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [category, setCategory] = useState(searchParams.get('category') || '')
  const [city, setCity] = useState(searchParams.get('city') || '')
  const [sort, setSort] = useState(searchParams.get('sort') || 'count_desc')

  useEffect(() => {
    setSearch(searchParams.get('search') || '')
    setCategory(searchParams.get('category') || '')
    setCity(searchParams.get('city') || '')
    setSort(searchParams.get('sort') || 'count_desc')
  }, [searchParams])

  const navigate = (values: Record<string, string | undefined>) => {
    const params = setTenantFilterParams(searchParams, values)
    router.push(`${pathname}?${params.toString()}#catalog`)
  }

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    navigate({ search: search.trim(), category, city, sort })
  }

  const reset = () => {
    setSearch('')
    setCategory('')
    setCity('')
    setSort('count_desc')
    router.push(`${pathname}#catalog`)
  }

  return (
    <section className={styles.panel}>
      <form className={styles.form} onSubmit={submit}>
        <div className={styles.fieldsGrid}>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className={styles.field}
            placeholder="Введите бренд, арендатора или код 1С"
          />
          <FilterSelect
            value={category}
            onChange={setCategory}
            placeholder="Категория"
            options={TENANT_CATEGORIES}
          />
          <FilterSelect
            value={city}
            onChange={setCity}
            placeholder="Город"
            options={TENANT_CITIES}
          />
          <FilterSelect
            value={sort}
            onChange={setSort}
            placeholder="Сортировка"
            options={TENANT_SORTS.map((item) => item.label)}
            values={TENANT_SORTS.map((item) => item.value)}
          />
          <button className={styles.submitButton}>Найти</button>
        </div>
      </form>
      <div className={styles.footer}>
        <div className={styles.chips}>
          {TENANT_QUICK_CATEGORIES.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => {
                setCategory(item.value)
                navigate({ category: item.value })
              }}
              className={`${styles.chip} ${category === item.value ? styles.chipActive : ''}`}
            >
              {item.label}
            </button>
          ))}
        </div>
        <button type="button" onClick={reset} className={styles.resetButton}>
          Сбросить фильтры
        </button>
      </div>
    </section>
  )
}

function FilterSelect({
  value,
  onChange,
  placeholder,
  options,
  values = options,
}: {
  value: string
  onChange: (value: string) => void
  placeholder: string
  options: readonly string[]
  values?: readonly string[]
}) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className={`${styles.field} ${styles.select}`}
    >
      <option value="">{placeholder}</option>
      {options.map((option, index) => (
        <option key={option} value={values[index]}>
          {option}
        </option>
      ))}
    </select>
  )
}
