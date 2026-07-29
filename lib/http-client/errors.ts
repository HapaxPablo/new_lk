import { NextResponse } from 'next/server'

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export const mapHttpClientError = (error: unknown) => {
  if (error instanceof ApiError) {
    return {
      status: error.status,
      message: error.message,
    }
  }

  const message =
    error instanceof Error ? error.message : 'Internal server error'

  const status = message.includes('Session expired')
    ? 401
    : message.includes('Request failed')
    ? 502
    : 500

  return {
    status,
    message,
  }
}

export const withApiErrorHandling = async (
  handler: () => Promise<Response>
) => {
  try {
    return await handler()
  } catch (error) {
    const { status, message } = mapHttpClientError(error)
    return NextResponse.json({ error: message }, { status })
  }
}
