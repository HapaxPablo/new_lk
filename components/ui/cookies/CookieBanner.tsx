'use client'

import { useCookieConsent } from '@/lib/hooks/useCookieConsent'
import Link from 'next/link'
import { useState } from 'react'
import styles from './CookieBanner.module.scss'

export default function CookieBanner() {
  const { hasConsent, isLoaded, acceptAll } = useCookieConsent()
  const [showSettings, setShowSettings] = useState(false)
  const [isRejected, setIsRejected] = useState(false)

  if (!isLoaded || hasConsent || isRejected) {
    return null
  }

  return (
    <div className={styles.banner}>
      <div className={styles.content}>
        <div className={styles.text}>
          <h3 className={styles.title}>Используем cookies</h3>
          <p className={styles.description}>
            Мы используем cookies для улучшения вашего опыта, аналитики и маркетинга.
            Ознакомьтесь с нашей{' '}
            <Link href="/privacy-policy" className={styles.link}>
              политикой конфиденциальности
            </Link>
            .
          </p>
        </div>

        {showSettings ? (
          <div className={styles.settings}>
            <div className={styles.checkbox}>
              <input
                type="checkbox"
                id="functional"
                defaultChecked
                disabled
                readOnly
              />
              <label htmlFor="functional">
                <strong>Функциональные</strong> (всегда включены)
              </label>
            </div>
            <div className={styles.checkbox}>
              <input type="checkbox" id="analytics" defaultChecked />
              <label htmlFor="analytics">Аналитика</label>
            </div>
            <div className={styles.checkbox}>
              <input type="checkbox" id="marketing" defaultChecked />
              <label htmlFor="marketing">Маркетинг</label>
            </div>
          </div>
        ) : null}

        <div className={styles.actions}>
          <button
            className={styles.buttonSecondary}
            onClick={() => setIsRejected(true)}
            type="button"
          >
            Отклонить
          </button>
          {!showSettings && (
            <button
              className={styles.buttonSecondary}
              onClick={() => setShowSettings(true)}
              type="button"
            >
              Параметры
            </button>
          )}
          <button
            className={styles.buttonPrimary}
            onClick={acceptAll}
            type="button"
          >
            Принять все
          </button>
        </div>
      </div>
    </div>
  )
}
