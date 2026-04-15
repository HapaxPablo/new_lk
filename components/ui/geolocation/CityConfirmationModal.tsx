// components/ui/geolocation/CityConfirmationModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { City } from '@/hooks/useCityDetection';

interface Props {
  isOpen: boolean;
  detectedCity: City | null;
  citiesList: string[];
  loading: boolean;
  onConfirm: (isCorrect: boolean) => void;
  onSelectCity: (city: string) => void;
}

export function CityConfirmationModal({
  isOpen,
  detectedCity,
  citiesList,
  loading,
  onConfirm,
  onSelectCity,
}: Props) {
  const [showCitySelector, setShowCitySelector] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCities, setFilteredCities] = useState<string[]>(citiesList);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setShowCitySelector(false);
      setSearchQuery('');
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    if (searchQuery === '') {
      setFilteredCities(citiesList);
    } else {
      setFilteredCities(
        citiesList.filter(city =>
          city.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery, citiesList]);

  if (!isOpen) return null;

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="fixed inset-0 bg-black bg-opacity-30" />
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="relative mx-auto max-w-md rounded-lg bg-white p-8 shadow-xl">
            <div className="flex items-center justify-center space-x-3">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
              <span className="text-gray-700">Определяем ваш город...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showCitySelector) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="fixed inset-0 bg-gray-300/55" onClick={() => setShowCitySelector(false)} />
        
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="relative mx-auto max-w-md w-full rounded-lg bg-white p-6 shadow-xl">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Выберите ваш город
            </h3>
            
            <input
              type="text"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Поиск города..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            
            <div className="mt-3 max-h-60 overflow-y-auto border border-gray-200 rounded-lg">
              {filteredCities.length > 0 ? (
                filteredCities.map((city) => (
                  <button
                    key={city}
                    onClick={() => onSelectCity(city)}
                    className="w-full text-left px-4 py-2 hover:bg-blue-50 hover:text-blue-900 transition-colors border-b border-gray-100 last:border-b-0"
                  >
                    {city}
                  </button>
                ))
              ) : (
                <div className="px-4 py-3 text-gray-500 text-center">
                  Город не найден
                </div>
              )}
            </div>
            
            <button
              onClick={() => setShowCitySelector(false)}
              className="mt-4 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Назад
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-gray-300/55" onClick={() => onConfirm(false)} />
      
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative mx-auto max-w-md w-full rounded-lg bg-white p-6 shadow-xl">
          <h3 className="text-xl font-semibold text-gray-900">
            Подтверждение города
          </h3>
          
          <p className="mt-4 text-gray-700">
            Ваш город <span className="font-semibold">{detectedCity?.name || '...'}</span>?
          </p>
          
          {detectedCity?.region && (
            <p className="mt-1 text-sm text-gray-500">
              {detectedCity.region}, {detectedCity.country}
            </p>
          )}
          
          <div className="mt-6 flex space-x-3">
            <button
              onClick={() => onConfirm(true)}
              className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Да
            </button>
            
            <button
              onClick={() => setShowCitySelector(true)}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Нет
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}