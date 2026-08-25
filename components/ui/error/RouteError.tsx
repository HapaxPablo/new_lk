'use client'

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert'
import { Button } from '@/components/ui/button'

interface RouteErrorProps {
  title: string
  reset: () => void
}

export function RouteError({ title, reset }: RouteErrorProps) {
  return (
    <div className="mx-auto flex min-h-48 w-full max-w-xl flex-col justify-center gap-4 p-6">
      <Alert variant="destructive">
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>Попробуйте загрузить страницу ещё раз.</AlertDescription>
      </Alert>
      <Button type="button" onClick={reset} className="self-start">
        Повторить
      </Button>
    </div>
  )
}
