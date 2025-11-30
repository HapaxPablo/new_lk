"use client"
import { useCallback } from 'react'
// хук для кнопок передаем функцию клика которая будет отрабатывать как в мобильной так и десктоп версии
export const useUniversalClick = () => {
  const handleUniversalClick = useCallback((
    callback: (() => void) | undefined,
    event?: React.SyntheticEvent
  ) => {
    event?.preventDefault?.()
    event?.stopPropagation?.()
    callback?.()
  }, [])

  return handleUniversalClick
}