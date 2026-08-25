'use client'

import { useEffect } from 'react'

interface GlobalErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex h-full min-h-48 flex-col items-center justify-center gap-4 p-6 text-center">
      <h2 className="text-xl font-bold text-slate-900">Что-то пошло не так</h2>
      <p className="max-w-md text-sm text-slate-600">
        Не удалось открыть страницу. Попробуйте ещё раз.
      </p>
      <button
        type="button"
        onClick={reset}
        className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
      >
        Повторить
      </button>
    </div>
  )
}
