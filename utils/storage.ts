'use client'
export interface ISavedFilters {
  brand?: string
  status?: string
  category?: string
  [key: string]: string | undefined
}

export interface IStorageSettings {
  savePermanently: boolean
}

export const StorageKeys = {
  FILTERS: 'app_filters',
  SETTINGS: 'app_storage_settings',
} as const

// Сохраняем фильтры в зависимости от настроек
export const saveFiltersToStorage = (
  filters: ISavedFilters,
  savePermanently: boolean
): void => {
  if (typeof window !== 'undefined') {
    const storage = savePermanently ? localStorage : sessionStorage
    storage.setItem(StorageKeys.FILTERS, JSON.stringify(filters))

    // Сохраняем настройки в localStorage
    const settings: IStorageSettings = { savePermanently }
    localStorage.setItem(StorageKeys.SETTINGS, JSON.stringify(settings))
  }
}

// Получаем фильтры из соответствующего хранилища
export const getFiltersFromStorage = (
  savePermanently?: boolean
): ISavedFilters | null => {
  if (typeof window !== 'undefined') {
    // Если не указано явно, получаем из настроек
    const storageType =
      savePermanently ?? getStorageSettings()?.savePermanently ?? false
    const storage = storageType ? localStorage : sessionStorage
    const stored = storage.getItem(StorageKeys.FILTERS)
    return stored ? JSON.parse(stored) : null
  }
  return null
}

// Получаем настройки хранения
export const getStorageSettings = (): IStorageSettings | null => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(StorageKeys.SETTINGS)
    return stored ? JSON.parse(stored) : null
  }
  return null
}

// Очищаем фильтры из обоих хранилищ
export const clearFiltersFromStorage = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(StorageKeys.FILTERS)
    sessionStorage.removeItem(StorageKeys.FILTERS)
  }
}

// Очищаем только настройки
export const clearStorageSettings = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(StorageKeys.SETTINGS)
  }
}
