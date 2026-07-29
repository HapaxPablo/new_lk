'use client'

interface Props {
  name: string
  description: string
  onNameChange: (value: string) => void
  onDescriptionChange: (value: string) => void
}

export function OrderNameFields({
  name,
  description,
  onNameChange,
  onDescriptionChange,
}: Props) {
  return (
    <>
      <div className="grid gap-2">
        <label className="text-sm font-medium text-gray-700">
          Название заказа
        </label>
        <input
          value={name}
          onChange={(event) => onNameChange(event.target.value)}
          placeholder="Наименование заказа"
          // className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500"
          className="flex w-full items-center justify-between rounded-2xl border border-gray-200! bg-white px-4 py-3 text-left text-sm text-gray-900 outline-none transition focus:border-blue-500"
        />
      </div>
      <div className="grid gap-2">
        <label className="text-sm font-medium text-gray-700">Описание</label>
        <textarea
          value={description}
          onChange={(event) => onDescriptionChange(event.target.value)}
          placeholder="Необязательно"
          className="min-h-20 flex w-full items-center justify-between rounded-2xl border border-gray-200! bg-white px-4 py-3 text-left text-sm text-gray-900 outline-none transition focus:border-blue-500"
        />
      </div>
    </>
  )
}
