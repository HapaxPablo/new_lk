'use client'

const BROADCAST_TYPES = [
  { value: '0', label: '0 — по режиму работы точки' },
  { value: '1', label: '1 — от начала работы + смещение' },
  { value: '2', label: '2 — от смещения до окончания' },
  { value: '3', label: '3 — конкретное время' },
  { value: '4', label: '4 — от начала до фиксированного времени' },
  { value: '5', label: '5 — от фиксированного времени до окончания' },
  { value: '6', label: '6 — по событию' },
] as const

const HINTS: Record<string, string> = {
  '0': 'Ролик выходит по расписанию работы точки — дополнительные настройки не нужны.',
  '1': 'Ролик стартует через указанное смещение после открытия точки.',
  '2': 'Ролик играет от смещения и до закрытия точки.',
  '3': 'Ролик выходит строго в заданном интервале времени.',
  '4': 'Ролик играет с открытия точки до указанного времени.',
  '5': 'Ролик играет с указанного времени до закрытия точки.',
  '6': 'Ролик запускается по внешнему событию.',
}

export const REQUIRES_TIMEDELTA = ['1', '2']
export const REQUIRES_START_TIME = ['3', '5']
export const REQUIRES_END_TIME = ['3', '4']

interface Props {
  broadcastType: string
  onBroadcastTypeChange: (value: string) => void
  weight: string
  onWeightChange: (value: string) => void
  timesInHour: string
  onTimesInHourChange: (value: string) => void
  timedelta: string
  onTimedeltaChange: (value: string) => void
  startTime: string
  onStartTimeChange: (value: string) => void
  endTime: string
  onEndTimeChange: (value: string) => void
}

export function AdBroadcastSettings({
  broadcastType,
  onBroadcastTypeChange,
  weight,
  onWeightChange,
  timesInHour,
  onTimesInHourChange,
  timedelta,
  onTimedeltaChange,
  startTime,
  onStartTimeChange,
  endTime,
  onEndTimeChange,
}: Props) {
  const needsTimedelta = REQUIRES_TIMEDELTA.includes(broadcastType)
  const needsStartTime = REQUIRES_START_TIME.includes(broadcastType)
  const needsEndTime = REQUIRES_END_TIME.includes(broadcastType)

  return (
    <div className="grid gap-4 rounded-2xl border border-gray-200 bg-gray-50/60 p-4">
      <div className="grid gap-2 sm:grid-cols-2">
        <div className="grid gap-2">
          <label className="text-sm font-medium text-gray-700">
            Тип вещания
          </label>
          <select
            value={broadcastType}
            onChange={(event) => onBroadcastTypeChange(event.target.value)}
            className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500"
          >
            {BROADCAST_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-medium text-gray-700">
            Приоритет (0–100)
          </label>
          <input
            type="number"
            min={0}
            max={100}
            value={weight}
            onChange={(event) => onWeightChange(event.target.value)}
            className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500"
          />
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-3">
        <div className="grid gap-2">
          <label className="text-sm font-medium text-gray-700">
            Выходов в час
          </label>
          <select
            value={timesInHour}
            onChange={(event) => onTimesInHourChange(event.target.value)}
            className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500"
          >
            {[1, 2, 3, 4, 6, 12].map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>

        {needsTimedelta && (
          <div className="grid gap-2">
            <label className="text-sm font-medium text-gray-700">
              Смещение (ЧЧ:ММ:СС)
            </label>
            <input
              type="time"
              step="1"
              value={timedelta}
              onChange={(event) => onTimedeltaChange(event.target.value)}
              className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500"
            />
          </div>
        )}

        {needsStartTime && (
          <div className="grid gap-2">
            <label className="text-sm font-medium text-gray-700">
              Начало (start_time)
            </label>
            <input
              type="time"
              step="1"
              value={startTime}
              onChange={(event) => onStartTimeChange(event.target.value)}
              className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500"
            />
          </div>
        )}

        {needsEndTime && (
          <div className="grid gap-2">
            <label className="text-sm font-medium text-gray-700">
              Окончание (end_time)
            </label>
            <input
              type="time"
              step="1"
              value={endTime}
              onChange={(event) => onEndTimeChange(event.target.value)}
              className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500"
            />
          </div>
        )}
      </div>

      <p className="text-xs text-gray-500">{HINTS[broadcastType]}</p>
    </div>
  )
}
