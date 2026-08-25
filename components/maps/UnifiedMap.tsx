'use client'

import dynamic from 'next/dynamic'

import { Skeleton } from '@/components/ui/skeleton'

import type { UnifiedMapProps } from './types'

function MapSkeleton({ className }: Pick<UnifiedMapProps, 'className'>) {
  return <Skeleton className={`h-full w-full ${className ?? ''}`} />
}

const UnifiedMapCanvas = dynamic(() => import('./UnifiedMapCanvas'), {
  ssr: false,
  loading: () => <MapSkeleton />,
})

export default function UnifiedMap(props: UnifiedMapProps) {
  return <UnifiedMapCanvas {...props} />
}

export type { MapMarker, UnifiedMapProps } from './types'
