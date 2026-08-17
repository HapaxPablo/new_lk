// stores/geoStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface City {
  name: string
  region?: string
  country?: string
  latitude?: number
  longitude?: number
}

interface GeoState {
  selectedCity: City | null
  isInitialized: boolean
  isGeolocationPromptDismissed: boolean
  coordinates: { latitude: number; longitude: number } | null
  detectedCity: City | null

  // Actions
  setSelectedCity: (city: City | null) => void
  setInitialized: (initialized: boolean) => void
  dismissGeolocationPrompt: () => void
  setCoordinates: (
    coords: { latitude: number; longitude: number } | null
  ) => void
  setDetectedCity: (city: City | null) => void
  clearCity: () => void
}

export const useGeoStore = create<GeoState>()(
  persist(
    (set) => ({
      selectedCity: null,
      isInitialized: false,
      isGeolocationPromptDismissed: false,
      coordinates: null,
      detectedCity: null,

      setSelectedCity: (city) =>
        set({
          selectedCity: city,
          isInitialized: true,
        }),

      setInitialized: (initialized) => set({ isInitialized: initialized }),

      dismissGeolocationPrompt: () =>
        set({ isGeolocationPromptDismissed: true }),

      setCoordinates: (coordinates) => set({ coordinates }),

      setDetectedCity: (city) => set({ detectedCity: city }),

      clearCity: () =>
        set({
          selectedCity: null,
          isInitialized: false,
          coordinates: null,
          detectedCity: null,
        }),
    }),
    {
      name: 'geo-storage',
      partialize: (state) => ({
        selectedCity: state.selectedCity,
        isInitialized: state.isInitialized,
        isGeolocationPromptDismissed: state.isGeolocationPromptDismissed,
      }),
    }
  )
)
