// components/ui/geolocation/CityDisplay.tsx
'use client';
import styles from './/GeoStyles.module.scss'
import { Navigation } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface CityDisplayProps {
  selectedCity: string | null;
  onCityChange: () => void;
  isLoading?: boolean;
}

export function CityDisplay({ selectedCity, onCityChange, isLoading }: CityDisplayProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  console.log('CityDisplay render:', { selectedCity, isLoading });

  // Закрываем дропдаун при клике вне области
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (isLoading) {
    return (
      <div className="city-display">
        <div className="flex items-center space-x-2 px-3 py-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
          <span className="text-sm text-gray-600">Определение...</span>
        </div>
      </div>
    );
  }

  if (!selectedCity) {
    return (
      <div className="city-display">
        <button
          onClick={() => {
            console.log('City button clicked - no city selected');
            onCityChange();
          }}
          className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
         <Navigation className={styles.geoIcon}/>
          <span className="text-sm text-gray-700">Выбрать город</span>
        </button>
      </div>
    );
  }

  return (
    <div className="city-display" ref={dropdownRef}>
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors group"
        >
 <Navigation className={styles.geoIcon}/>
          <span className="text-sm font-medium text-gray-900">{selectedCity}</span>

        </button>

        {/* Дропдаун меню */}
        {isOpen && (
          <div className="absolute top-full left-0 mt-2 w-48 rounded-lg bg-white shadow-lg border border-gray-200 py-1 z-50">
            <div className="px-4 py-2 border-b border-gray-100">
              <p className="text-xs text-gray-500">Текущий город</p>
              <p className="text-sm font-semibold text-gray-900">{selectedCity}</p>
            </div>
            <button
              onClick={() => {
                console.log('Change city clicked');
                onCityChange();
                setIsOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2"
            >
              <Navigation className={styles.geoIcon}/>
              <span>Изменить город</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}