import { HttpClient1C } from '@/lib/http-client'
import { TASK_TYPES, type TTaskType } from '@/types/orders'
import { NextRequest } from 'next/server'

interface TaskActionPayload {
  type: TTaskType
  parameters: {
    order_id: string
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = (await request.json()) as TaskActionPayload

    if (!id) {
      return Response.json(
        { error: 'Не указан ID номенклатуры' },
        { status: 400 }
      )
    }

    if (!body.type || !(body.type in TASK_TYPES)) {
      return Response.json(
        { error: 'Указан неизвестный тип действия' },
        { status: 400 }
      )
    }

    if (!body.parameters?.order_id) {
      return Response.json({ error: 'Не указан ID заказа' }, { status: 400 })
    }

    const response = await HttpClient1C.server(request).post(
      `api/tasks/${id}/actions/`,
      body
    )

    return Response.json(response)
  } catch (error: unknown) {
    const requestError = error as Error & { status?: number }
    const message =
      error instanceof Error ? error.message : 'Не удалось выполнить действие'
    const rawDetail = message.replace(/^Request failed:\s*/, '')
    let errorMessage = rawDetail

    try {
      const errorData = JSON.parse(rawDetail)
      errorMessage = errorData.detail || errorData.error || message
    } catch {
      // Ответ backend не в формате JSON — возвращаем его как есть.
    }

    return Response.json(
      { error: errorMessage },
      { status: requestError.status || 500 }
    )
  }
}
