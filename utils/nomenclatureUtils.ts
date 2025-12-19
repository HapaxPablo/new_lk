import { EWeekDays, IDaySettings, INomenclatureDetailsItem } from "@/types/nomenclature";

/**
 * Функция для получения настроек конкретного дня
 */
export const getDaySettings = (
  nomenclature: INomenclatureDetailsItem,
  day: EWeekDays
): IDaySettings => {
  return nomenclature.settings[day];
};

/**
 * Функция для получения основного изображения (первое из exterior или interior)
 */
export const getMainImage = (
  nomenclature: INomenclatureDetailsItem
): string | null => {
  return nomenclature.exterior[0]?.source || 
         nomenclature.interior[0]?.source || 
         null;
};

/**
 * Функция для форматирования цены
 */
export const formatPrice = (price: string): string => {
  const numericPrice = parseFloat(price);
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
  }).format(numericPrice);
};

