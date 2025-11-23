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
 * Функция для проверки статуса устройства
 */
export const isDeviceOnline = (nomenclature: INomenclatureDetailsItem): boolean => {
  // Предположим, что статус 0 означает онлайн, 1 - офлайн доработать позже
  return nomenclature.main_info.status === 0;
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

