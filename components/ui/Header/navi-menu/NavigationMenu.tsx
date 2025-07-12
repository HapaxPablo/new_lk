'use client'
import dynamic from 'next/dynamic'
import { useMediaQuery } from 'usehooks-ts'

const NavigationMenuDesktop = dynamic(
  () =>
    import('./NavigationMenuDesktop').then((mod) => ({
      default: mod.default,
    })),
  { ssr: false, loading: () => <div>Loading...</div> }
)

const NavigationMenuMobile = dynamic(
  () =>
    import('./NavigationMenuMobile').then((mod) => ({
      default: mod.default,
    })),
  { ssr: false, loading: () => <div>Loading...</div> }
)

const NavigationMenu = () => {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  return <>{isDesktop ? <NavigationMenuDesktop /> : <NavigationMenuMobile />}</>
}
export default NavigationMenu
