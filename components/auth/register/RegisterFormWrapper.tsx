'use client'

import dynamic from 'next/dynamic'
import { useMediaQuery } from 'usehooks-ts'

const RegisterFormDesktop = dynamic(
  () =>
    import('./desktop/RegisterFormDesktop').then((mod) => ({
      default: mod.RegisterFormDesktop,
    })),
  { ssr: false, loading: () => <div>Loading...</div> }
)

const RegisterFormMobile = dynamic(
  () =>
    import('./mobile/RegisterFormMobile').then((mod) => ({
      default: mod.RegisterFormMobile,
    })),
  { ssr: false, loading: () => <div>Loading...</div> }
)

export const RegistrationWrapper = () => {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  return <>{isDesktop ? <RegisterFormDesktop /> : <RegisterFormMobile />}</>
}
