import {
  EWeekDays,
  IDaySettings,
  INomenclatureDetailsItem,
} from '@/types/nomenclature'

/**
 * Функция для получения настроек конкретного дня
 */
export const getDaySettings = (
  nomenclature: INomenclatureDetailsItem,
  day: EWeekDays
): IDaySettings => {
  return nomenclature.settings[day]
}

/**
 * Функция для получения основного изображения (первое из exterior или interior)
 */
export const getMainImage = (
  nomenclature: INomenclatureDetailsItem
): string | null => {
  return (
    nomenclature.exterior[0]?.source || nomenclature.interior[0]?.source || null
  )
}

/**
 * Функция для форматирования цены
 */
export const formatPrice = (price: string): string => {
  const numericPrice = parseFloat(price)
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
  }).format(numericPrice)
}

/**
 * Функция для форматирования количества штук носителей
 */
export const formatMediaUnits = (units: string): string => {
  return `${units} шт`
}

/**
 * Функция для форматирования рабочего времени
 */
export const formatWorkTime = (start: string, end: string): string => {
  return `${start} - ${end}`
}

/**
 * Функция для форматирования площади
 */
export const formatSquare = (square: string): string => {
  return `${square} м²`
}

/**
 * Функция для форматирования проходимости */
export const formatPossibility = (possibility: string): string => {
  return `${possibility} чел/мес`
}
