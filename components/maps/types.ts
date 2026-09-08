export interface MapMarker {
  id: string
  coordinates: [lng: number, lat: number]
  title: string
  address?: string
  imageUrl?: string
  logoUrl?: string
  href?: string
}

export interface UnifiedMapProps {
  markers: MapMarker[]
  initialView?: { center: [number, number]; zoom: number }
  selectedMarkerId?: string | null
  onMarkerSelect?: (id: string) => void
  interaction?: 'full' | 'static'
  cluster?: boolean
  showPopup?: boolean
  fit?: 'markers' | 'none'
  className?: string
}
