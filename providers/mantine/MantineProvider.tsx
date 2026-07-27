'use client'

import { MantineProvider as Provider } from '@mantine/core'

export function MantineProvider({ children }: { children: React.ReactNode }) {
  return <Provider>{children}</Provider>
}
