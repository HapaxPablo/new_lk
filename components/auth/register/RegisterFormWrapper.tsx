'use client'

import dynamic from 'next/dynamic'

const RegisterFormDesktop = dynamic(
  () =>
    import('./form/RegisterForm').then((mod) => ({
      default: mod.RegisterFormDesktop,
    })),
  { ssr: false, loading: () => <div>Loading...</div> }
)
export const RegistrationWrapper = () => {
  return <RegisterFormDesktop />
}
