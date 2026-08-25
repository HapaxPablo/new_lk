import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 p-4">
      <Skeleton className="h-96 w-full" />
      <Skeleton className="h-10 w-2/3" />
      <Skeleton className="h-24 w-full" />
    </div>
  )
}
