'use client'

interface Props {
  lower: string
  upper: string
  onLowerChange: (value: string) => void
  onUpperChange: (value: string) => void
}

export function BroadcastIntervalFields({
  lower,
  upper,
  onLowerChange,
  onUpperChange,
}: Props) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      <div className="grid gap-2">
        <label className="text-sm font-medium text-gray-700">Начало</label>
        <input
          type="datetime-local"
          value={lower}
          onChange={(event) => onLowerChange(event.target.value)}
          className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500"
        />
      </div>
      <div className="grid gap-2">
        <label className="text-sm font-medium text-gray-700">Окончание</label>
        <input
          type="datetime-local"
          value={upper}
          onChange={(event) => onUpperChange(event.target.value)}
          className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500"
        />
      </div>
    </div>
  )
}
