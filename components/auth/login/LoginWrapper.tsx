'use client'

import dynamic from 'next/dynamic'
import { useMediaQuery } from 'usehooks-ts'

const LoginFormMobile = dynamic(
  () =>
    import('./mobile/LoginFormMobile').then((mod) => ({
      default: mod.LoginFormMobile,
    })),
  { ssr: false, loading: () => <div>Loading...</div> }
)

const LoginFormDesktop = dynamic(
  () =>
    import('./desktop/LoginFormDesktop').then((mod) => ({
      default: mod.LoginFormDesktop,
    })),
  { ssr: false, loading: () => <div>Loading...</div> }
)

export const LoginWrapper = () => {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  return <>{isDesktop ? <LoginFormDesktop /> : <LoginFormMobile />}</>
}
