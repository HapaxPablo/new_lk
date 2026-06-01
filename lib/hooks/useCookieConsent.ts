'use client'

import { useEffect, useState } from 'react'

const COOKIE_CONSENT_KEY = 'cookie-consent'

export interface CookieConsent {
  analytics: boolean
  marketing: boolean
  functional: boolean
}

export function useCookieConsent() {
  const [consent, setConsent] = useState<CookieConsent | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY)
    if (stored) {
      try {
        setConsent(JSON.parse(stored))
      } catch {
        setConsent(null)
      }
    }
    setIsLoaded(true)
  }, [])

  const updateConsent = (newConsent: CookieConsent) => {
    setConsent(newConsent)
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(newConsent))
  }

  const acceptAll = () => {
    const allAccepted: CookieConsent = {
      analytics: true,
      marketing: true,
      functional: true,
    }
    updateConsent(allAccepted)
  }

  const rejectAll = () => {
    const allRejected: CookieConsent = {
      analytics: false,
      marketing: false,
      functional: true,
    }
    updateConsent(allRejected)
  }

  const hasConsent = consent !== null

  return {
    consent,
    isLoaded,
    hasConsent,
    updateConsent,
    acceptAll,
    rejectAll,
  }
}
