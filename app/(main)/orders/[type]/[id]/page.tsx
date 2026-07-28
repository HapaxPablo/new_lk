import Link from 'next/link'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import {
  BROADCAST_TYPE_LABELS,
  ORDER_STATUS_LABELS,
  ORDER_TYPE_LABELS,
  TOrderKind,
} from '@/types/orders'
import { getAdOrderDetail, getBgOrderDetail } from '@/app/api/orders/route'
import { formatDateTime, formatTimedelta } from '../formatters'

interface OrderDetailPageProps {
  params: Promise<{
    type: string
    id: string
  }>
}

function isValidType(type: string): type is TOrderKind {
  return type === 'ad' || type === 'bg'
}

export async function generateMetadata({
  params,
}: OrderDetailPageProps): Promise<Metadata> {
  const { type, id } = await params
  return {
    title: `Расшифровка ${type === 'ad' ? 'рекламного' : 'фонового'} заказа ${id}`,
  }
}

export default async function OrderDetailPage({
  params,
}: OrderDetailPageProps) {
  const { type, id } = await params

  if (!isValidType(type)) {
    notFound()
  }

  let errorMessage = ''
  let adOrder: Awaited<ReturnType<typeof getAdOrderDetail>> | null = null
  let bgOrder: Awaited<ReturnType<typeof getBgOrderDetail>> | null = null

  try {
    if (type === 'ad') {
      adOrder = await getAdOrderDetail(id)
    } else {
      bgOrder = await getBgOrderDetail(id)
    }
  } catch (error) {
    errorMessage =
      error instanceof Error
        ? error.message
        : 'Не удалось загрузить информацию о заказе'
  }

  const order = adOrder || bgOrder

  return (
    <div className="overflow-auto p-6">
      <Link href="/orders" className="text-sm text-blue-600 pb-2 inline-block">
        Назад к заказам
      </Link>

      {errorMessage ? (
        <div className="text-red-600 mt-4">{errorMessage}</div>
      ) : !order ? (
        <div className="mt-4">Загрузка...</div>
      ) : (
        <div className="space-y-6 mt-4">
          {/* Основная информация */}
          <div className="space-y-2 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="mb-2 inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                  {type === 'ad' ? 'Рекламный заказ' : 'Заказ фоновой музыки'}
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  {order.name}
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  {order.description || 'Описание отсутствует'}
                </p>
              </div>
              <div className="grid gap-2 text-sm text-gray-600 sm:text-right">
                <div>
                  <span className="font-medium text-gray-900">ID: </span>
                  <span className="font-mono text-xs">{order.id}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Создано: </span>
                  {formatDateTime(order.created)}
                </div>
                <div>
                  <span className="font-medium text-gray-900">Автор: </span>
                  {order.owner?.full_name || '-'}
                </div>
                <div>
                  <span className="font-medium text-gray-900">Статус: </span>
                  {ORDER_STATUS_LABELS[order.status] ?? order.status}
                </div>
              </div>
            </div>
          </div>

          {/* Клиент */}
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">Клиент</h3>
            <p className="mt-2 text-sm text-gray-600">
              {order.client?.name || '-'}
            </p>
          </div>

          {/* Плейлист */}
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Плейлист
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  {order.playlist?.name || '-'}
                </p>
              </div>
              <div className="text-sm text-gray-600 sm:text-right">
                <div>
                  Файлов в плейлисте:{' '}
                  <strong>{order.playlist?.files_count ?? 0}</strong>
                </div>
                {order.playlist?.id && (
                  <Link
                    href={`/orders/playlists/${order.playlist.id}`}
                    className="text-blue-600 hover:underline"
                    target="_blank"
                  >
                    Открыть плейлист →
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Интервал вещания */}
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">
              Интервал вещания
            </h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div>
                <div className="text-xs text-gray-500">Начало</div>
                <div className="text-sm font-medium text-gray-900">
                  {formatDateTime(order.broadcast_interval?.lower)}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Окончание</div>
                <div className="text-sm font-medium text-gray-900">
                  {formatDateTime(order.broadcast_interval?.upper)}
                </div>
              </div>
            </div>
          </div>

          {/* Тип заказа / тип вещания — специфично для ad/bg */}
          {type === 'ad' && adOrder && (
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900">
                Параметры вещания
              </h3>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div>
                  <div className="text-xs text-gray-500">Тип вещания</div>
                  <div className="text-sm font-medium text-gray-900">
                    {adOrder.broadcast_type} —{' '}
                    {BROADCAST_TYPE_LABELS[adOrder.broadcast_type] ?? '—'}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Выходов в час</div>
                  <div className="text-sm font-medium text-gray-900">
                    {adOrder.parameters?.times_in_hour ?? '—'}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">
                    Приоритет (weight)
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    {adOrder.parameters?.weight ?? '—'}
                  </div>
                </div>
                {adOrder.parameters?.timedelta && (
                  <div>
                    <div className="text-xs text-gray-500">Смещение</div>
                    <div className="text-sm font-medium text-gray-900">
                      {formatTimedelta(adOrder.parameters.timedelta)}
                    </div>
                  </div>
                )}
                {adOrder.parameters?.start_time && (
                  <div>
                    <div className="text-xs text-gray-500">
                      Начало (start_time)
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {adOrder.parameters.start_time}
                    </div>
                  </div>
                )}
                {adOrder.parameters?.end_time && (
                  <div>
                    <div className="text-xs text-gray-500">
                      Окончание (end_time)
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {adOrder.parameters.end_time}
                    </div>
                  </div>
                )}
              </div>

              {adOrder.slides && (
                <div className="mt-4">
                  <div className="text-xs text-gray-500 mb-2">Слайды</div>
                  <div className="space-y-2">
                    {Object.entries(adOrder.slides).map(([groupId, files]) => (
                      <div
                        key={groupId}
                        className="rounded-2xl border border-gray-100 bg-gray-50 p-3"
                      >
                        <div className="text-xs font-mono text-gray-500">
                          {groupId}
                        </div>
                        <div className="mt-1 text-sm text-gray-700">
                          Файлов: {files.length}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {type === 'bg' && bgOrder && (
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900">
                Тип контента
              </h3>
              <p className="mt-2 text-sm text-gray-700">
                {bgOrder.order_type} —{' '}
                {ORDER_TYPE_LABELS[bgOrder.order_type] ?? '—'}
              </p>

              {bgOrder.parameters &&
                Object.keys(bgOrder.parameters).length > 0 && (
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {Object.entries(bgOrder.parameters).map(([key, value]) => (
                      <div key={key}>
                        <div className="text-xs text-gray-500">{key}</div>
                        <div className="text-sm font-medium text-gray-900">
                          {String(value)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
