'use client'

import { useOlfFetcher } from '@/hooks/useOlfFetcher'
import { useState } from 'react'
import RegisterFormIndividual from '../../register/registerForm/RegisterFormIndividual'
import RegisterFormLegal from '../../register/registerForm/RegisterFormLegal'
import styles from './RegisterFormMobile.module.scss'

export function RegisterFormMobile() {
  const [typeOlf, setTypeOlf] = useState<string>('')
  const { olfIndividual, olfLegal } = useOlfFetcher(typeOlf)
  return (
    <div className={styles.form}>
      <div className={styles.title}>Регистрация</div>
      <div className={styles.fieldGroup}>
        <select
          id="opf"
          value={typeOlf}
          onChange={(e) => setTypeOlf(e.target.value)}
          className={styles.select}
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
      </div>
    </div>
  )
}
