const DAYS_IN_MONTH = 30

export interface WorktimeSettings {
  worktime_start: string
  worktime_end: string
  slots_per_hour: string
}

function getMinutesFromTime(time: string): number | null {
  const match = /^(\d{2}):(\d{2})$/.exec(time)

  if (!match) return null

  const hours = Number(match[1])
  const minutes = Number(match[2])

  if (hours > 23 || minutes > 59) return null

  return hours * 60 + minutes
}

/** Рассчитывает количество рекламных выходов за условный 30-дневный месяц. */
export function calculateMonthlyExits({
  worktime_start,
  worktime_end,
  slots_per_hour,
}: WorktimeSettings): string {
  const startMinutes = getMinutesFromTime(worktime_start)
  const endMinutes = getMinutesFromTime(worktime_end)
  const slotsPerHour = Number(slots_per_hour)

  if (
    startMinutes === null ||
    endMinutes === null ||
    !Number.isFinite(slotsPerHour) ||
    slotsPerHour < 0
  ) {
    return ''
  }

  const durationInMinutes =
    endMinutes >= startMinutes
      ? endMinutes - startMinutes
      : 24 * 60 - startMinutes + endMinutes
  const monthlyExits = (durationInMinutes / 60) * slotsPerHour * DAYS_IN_MONTH
  const formattedExits = new Intl.NumberFormat('ru-RU')
    .format(monthlyExits)
    .replace(/[\u00A0\u202F]/g, ' ')

  return `${formattedExits} выходов в месяц`
}
