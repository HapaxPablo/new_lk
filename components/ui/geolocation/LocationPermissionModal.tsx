'use client';

import { useEffect } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onEnable: () => void;
}

export function LocationPermissionModal({ isOpen, onClose, onEnable }: Props) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-gray-300/55 transition-opacity" onClick={onClose} />
      
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative mx-auto max-w-md rounded-lg bg-white p-6 shadow-xl">
          <div className="text-center">
            {/* Иконка локации */}
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            
            <h3 className="mt-4 text-xl font-semibold text-gray-900">
              Определение города
            </h3>
            
            <p className="mt-2 text-gray-600">
              Для автоматического определения вашего города необходимо разрешить доступ к геолокации
            </p>
            
            <div className="mt-6 space-y-3">
              <button
                onClick={onEnable}
                className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Разрешить
              </button>
              
              <button
                onClick={onClose}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Не сейчас
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}