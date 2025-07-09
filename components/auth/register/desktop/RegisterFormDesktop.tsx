'use client'

import { useOlfFetcher } from '@/hooks/useOlfFetcher'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import styles from '../registerForm/RegisterForm.module.scss'
import RegisterFormIndividual from '../registerForm/RegisterFormIndividual'
import RegisterFormLegal from '../registerForm/RegisterFormLegal'

export function RegisterFormDesktop() {
  const [typeOlf, setTypeOlf] = useState<string>('')
  const { olfIndividual, olfLegal } = useOlfFetcher(typeOlf)

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <div className={styles.logoWrapper}>
          <Image
            src="/alt-logo.svg"
            alt="logo"
            width={120}
            height={24}
            priority
            className="w-auto h-auto"
          />
        </div>
        <div className={styles.title}>Регистрация</div>
        <select
          onChange={(e) => setTypeOlf(e.target.value)}
          className={styles.select}
          value={typeOlf}
        >
          <option value="" disabled>
            ОПФ
          </option>
          <option value="individual">Физическое лицо</option>
          <option value="legal">Юридическое лицо</option>
        </select>
        {typeOlf === 'individual' && olfIndividual && (
          <RegisterFormIndividual olfIndividual={olfIndividual} />
        )}
        {typeOlf === 'legal' && olfLegal && (
          <RegisterFormLegal olfLegal={olfLegal} />
        )}
        <div className={styles.registerWrapper}>
          <div className={styles.registerWrapper_text}>
            Уже есть аккаунт?{' '}
            <Link href="/login" className={styles.registerWrapper_link}>
              Войдите здесь.
            </Link>
          </div>
        </div>
      </div>
      <div className={styles.imgWrapper}>
        <div className={styles.img} />
      </div>
    </div>
  )
}
