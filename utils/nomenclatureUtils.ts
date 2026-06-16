import {
  EWeekDays,
  IDaySettings,
  INomenclatureDetailsItem,
} from '@/types/nomenclature'
import { cityFrom, cityIn } from 'lvovich'

/**
 * Функция для получения настроек конкретного дня

export const getDaySettings = (
  nomenclature: INomenclatureDetailsItem,
  day: EWeekDays
): IDaySettings => {
  return nomenclature.settings[day]
}
*/

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

export type CaseType = 'nominative' | 'genitive' | 'prepositional'

/**
 * Возвращает название города в нужном падеже.
 * @param city - название города (именительный падеж)
 * @param caseType - 'nominative' или 'genitive'
 * @returns город в указанном падеже
 */
export function declineCity(city: string, caseType: CaseType) {
  if (!city) return ''

  if (caseType === 'nominative') {
    return city
  }

  try {
    if (caseType === 'genitive') {
      // cityFrom возвращает родительный падеж
      const genitive = cityFrom(city)
      return genitive || city // если не удалось, возвращаем исходное название
    } else if (caseType === 'prepositional') {
      const prepositional = cityIn(city)
      console.log('prepositional', prepositional)
      return prepositional || city
    }
  } catch {
    // в случае ошибки (например, город не распознан) возвращаем исходное
    return city
  }
}

export type TitleVariant = 'full' | 'compact'

export function formatPlaceTitle(
  place: INomenclatureDetailsItem,
  variant: TitleVariant = 'full'
): string {
  const { address, typeOfPlace, contentType, brand } = place
  const placeType = typeOfPlace.abbreviation || typeOfPlace.name
  const brandName = brand?.name

  // Глагольная часть в зависимости от типа контента
  let action = ''
  if (contentType === 'Аудио') {
    action = 'Размещение ролика на радио'
  } else if (contentType === 'Аудиовизуальная') {
    action = 'Размещение аудиовизуальной рекламы'
  } else {
    action = 'Размещение рекламы'
  }

  const city = address.city
  const street = address.street
  const house = address.house
  const localityType = address.localityType || 'г.'
  const streetType = address.streetType || 'ул.'

  // Компактный вариант – только тип места и город (в родительном падеже)
  if (variant === 'compact') {
    const cityGenitive = declineCity(city, 'genitive')
    // Пример: "Размещение аудиовизуальной рекламы в ТЦ Волгограда"
    return `${action} в ${placeType} ${cityGenitive}`
  }

  // Полный вариант – с брендом (если есть) и полным адресом (именительный падеж)
  const cityNominative = declineCity(city, 'nominative') // просто city
  let addressStr = ''
  if (street && house) {
    addressStr = `${localityType} ${cityNominative}, ${streetType} ${street}, д. ${house}`
  } else if (city) {
    // Если улицы нет, то просто город в именительном
    addressStr = `${localityType} ${cityNominative}`
  }

  const parts = [action]
  if (brandName) {
    parts.push(`${placeType} "${brandName}"`)
  } else {
    parts.push(placeType)
  }

  if (addressStr) {
    if (brandName) {
      parts.push(addressStr)
    } else {
      // Если бренда нет, добавляем предлог "по адресу"
      parts.push(`по адресу ${addressStr}`)
    }
  }

  return parts.join(' ')
}
