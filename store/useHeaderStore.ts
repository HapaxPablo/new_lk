// store/headerStore.ts
import { create } from 'zustand'

interface HeaderStore {
  subtitle: string
  setSubtitle: (s: string) => void
  clearSubtitle: () => void
}

export const useHeaderStore = create<HeaderStore>((set) => ({
  subtitle: '',
  setSubtitle: (subtitle) => set({ subtitle }),
  clearSubtitle: () => set({ subtitle: '' }),
}))
