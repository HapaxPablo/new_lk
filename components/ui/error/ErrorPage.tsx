'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button/Button'

interface ErrorProps {
  error: Error
  reset: () => void
}

export default function ErrorPage({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Global error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-24 h-24 mx-auto bg-red-100 rounded-full flex items-center justify-center">
          <AlertTriangle className="w-16 h-16 text-red-500" />
        </div>
        
        <div className="space-y-3">
          <h1 className="text-2xl font-bold text-gray-900">
            Что-то пошло не так
          </h1>
          <p className="text-gray-600">
            Произошла непредвиденная ошибка. Пожалуйста, попробуйте снова.
          </p>
          {process.env.NODE_ENV === 'development' && (
            <pre className="text-xs text-left p-3 bg-gray-100 rounded overflow-auto">
              {error.message}
            </pre>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={reset}
            className="flex items-center justify-center gap-2"
          >
            <RefreshCw size={18} />
            Попробовать снова
          </Button>
          
          <Button
            variant='default'
            onClick={() => window.location.href = '/'}
          >
            На главную
          </Button>
        </div>
      </div>
    </div>
  )
}