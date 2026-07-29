// app/(main)/orders/[type]/create/components/FormRow.tsx
import { ReactNode } from 'react'

export function FormRow({ children }: { children: ReactNode }) {
  return <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">{children}</div>
}
