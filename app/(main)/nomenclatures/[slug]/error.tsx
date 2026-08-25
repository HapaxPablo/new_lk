'use client'

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert'
import { Button } from '@/components/ui/button'

interface ErrorProps {
  reset: () => void
}

export default function Error({ reset }: ErrorProps) {
  return (
    <div className="mx-auto flex min-h-48 w-full max-w-xl flex-col justify-center gap-4 p-6">
      <Alert variant="destructive">
        <AlertTitle>Не удалось открыть площадку</AlertTitle>
        <AlertDescription>Попробуйте загрузить страницу ещё раз.</AlertDescription>
      </Alert>
      <Button type="button" onClick={reset} className="self-start">
        Повторить
      </Button>
    </div>
  )
}
