import { useEffect, useMemo, useRef, useState } from 'react'
import { DatePicker } from '@skbkontur/react-ui/components/DatePicker'

const addDays = (date: Date, days: number) => {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

export const formatDate = (date: Date) => date.toLocaleDateString('ru-RU')

export const parseDate = (value: string): Date | null => {
  if (!value) return null
  const [day, month, year] = value.split('.')
  const parsed = new Date(Number(year), Number(month) - 1, Number(day))
  return isNaN(parsed.getTime()) ? null : parsed
}

const diffDays = (start: Date, end: Date) =>
  Math.max(
    1,
    Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  )

export function useDateRange() {
  const defaultStart = addDays(new Date(), 2)
  const defaultEnd = addDays(defaultStart, 30)

  const [startDateValue, setStartDateValue] = useState(formatDate(defaultStart))
  const [endDateValue, setEndDateValue] = useState(formatDate(defaultEnd))

  const [startError, setStartError] = useState(false)
  const [endError, setEndError] = useState(false)
  const [startTooltip, setStartTooltip] = useState(false)
  const [endTooltip, setEndTooltip] = useState(false)

  const parsedStart = parseDate(startDateValue) ?? defaultStart
  const parsedEnd = parseDate(endDateValue) ?? defaultEnd

  const minStartDate = formatDate(addDays(new Date(), 2))
  const minEndDate = formatDate(addDays(parsedStart, 1))

  const days = useMemo(
    () => diffDays(parsedStart, parsedEnd),
    [parsedStart, parsedEnd]
  )

  const parsedStartRef = useRef(parsedStart)
  const parsedEndRef = useRef(parsedEnd)

  useEffect(() => {
    parsedStartRef.current = parsedStart
  }, [parsedStart])
  useEffect(() => {
    parsedEndRef.current = parsedEnd
  }, [parsedEnd])

  const unvalidateStart = () => {
    setStartError(false)
    setStartTooltip(false)
  }

  const validateStart = () => {
    const valid = DatePicker.validate(startDateValue, { minDate: minStartDate })
    const hasError = !!startDateValue && !valid
    setStartError(hasError)
    setStartTooltip(hasError)
    if (hasError) return
    const newStart = parseDate(startDateValue)
    if (!newStart) return
    const minAllowedEnd = addDays(newStart, 1)
    const currentEnd = parseDate(endDateValue)
    if (currentEnd && currentEnd < minAllowedEnd)
      setEndDateValue(formatDate(minAllowedEnd))
  }

  const unvalidateEnd = () => {
    setEndError(false)
    setEndTooltip(false)
  }

  const validateEnd = () => {
    const valid = DatePicker.validate(endDateValue, { minDate: minEndDate })
    const hasError = !!endDateValue && !valid
    setEndError(hasError)
    setEndTooltip(hasError)
  }

  const reset = () => {
    setStartDateValue(formatDate(defaultStart))
    setEndDateValue(formatDate(defaultEnd))
  }

  return {
    startDateValue,
    setStartDateValue,
    endDateValue,
    setEndDateValue,
    startError,
    endError,
    startTooltip,
    setStartTooltip,
    endTooltip,
    setEndTooltip,
    minStartDate,
    minEndDate,
    days,
    parsedStartRef,
    parsedEndRef,
    validateStart,
    unvalidateStart,
    validateEnd,
    unvalidateEnd,
    reset,
  }
}
