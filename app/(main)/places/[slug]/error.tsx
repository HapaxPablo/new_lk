'use client'

import { RouteError } from '@/components/ui/error/RouteError'

export default function Error({ reset }: { reset: () => void }) {
  return <RouteError title="Не удалось открыть площадку" reset={reset} />
}
