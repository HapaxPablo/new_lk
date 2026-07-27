'use client'

import { NAV_ITEMS } from '@/lib/configs/configMenuHeader'
import { log } from 'console'
import { usePathname } from 'next/navigation'

const PageDevelop = () => {
  const path = usePathname()
  // console.log(path)
  const title = NAV_ITEMS.find((item) => item.path === path)?.title
  return (
    <div className="flex flex-col justify-center items-center w-full h-full text-center">
      <h1>{title || 'Страница не определена'}</h1>
      <h3>Страница находится в разработке</h3>
      <span>Мы активно работаем над ней, скоро она станет доступна!</span>
    </div>
  )
}
export default PageDevelop
