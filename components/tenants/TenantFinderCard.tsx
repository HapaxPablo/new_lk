'use client'

import {
  setTenantFilterParams,
  TENANT_CATEGORIES,
  TENANT_CITIES,
} from '@/lib/tenants/filters'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { FormEvent, useEffect, useState } from 'react'
import styles from './TenantFinderCard.module.scss'
import { EntityCard } from '@/components/ui/card/EntityCard'

export function TenantFinderCard() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [category, setCategory] = useState(searchParams.get('category') || '')
  const [city, setCity] = useState(searchParams.get('city') || '')

  useEffect(() => {
    setSearch(searchParams.get('search') || '')
    setCategory(searchParams.get('category') || '')
    setCity(searchParams.get('city') || '')
  }, [searchParams])

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const params = setTenantFilterParams(searchParams, {
      search: search.trim(),
      category,
      city,
    })
    router.push(`${pathname}?${params.toString()}#catalog`)
  }

  const searchTenant = (tenant: string) => {
    setSearch(tenant)
    const params = setTenantFilterParams(searchParams, {
      search: tenant,
      category,
      city,
    })
    router.push(`${pathname}?${params.toString()}#catalog`)
  }

  return (
    <EntityCard className={styles.card}>
      <div className={styles.title}>Найти арендатора</div>
      <p className={styles.description}>
        Введите бренд, арендатора, категорию или код 1С, чтобы найти площадки,
        где он представлен.
      </p>
      <form className={styles.form} onSubmit={submit}>
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className={styles.field}
          placeholder="Например: Детский мир, DNS, Сбербанк"
        />
        <div className={styles.selectGrid}>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className={`${styles.field} ${styles.select}`}
          >
            <option value="">Категория арендатора</option>
            {TENANT_CATEGORIES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <select
            value={city}
            onChange={(event) => setCity(event.target.value)}
            className={`${styles.field} ${styles.select}`}
          >
            <option value="">Город</option>
            {TENANT_CITIES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <button className={styles.submitButton}>Найти арендатора</button>
      </form>
      <div className={styles.popular}>
        <div className={styles.popularTitle}>Популярные арендаторы</div>
        <div className={styles.chips}>
          {['Детский мир', 'DNS', 'Сбербанк', 'Билайн'].map((tenant) => (
            <button
              key={tenant}
              type="button"
              onClick={() => searchTenant(tenant)}
              className={styles.chip}
            >
              {tenant}
            </button>
          ))}
        </div>
      </div>
    </EntityCard>
  )
}
