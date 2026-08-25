export default function Loading() {
  return (
    <div
      className="flex h-full min-h-48 items-center justify-center p-6"
      role="status"
      aria-live="polite"
    >
      <span className="text-sm text-slate-600">Загрузка...</span>
    </div>
  )
}
