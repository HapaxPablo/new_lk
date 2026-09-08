import { fetchWithRetry } from '@/lib/http-client/fetchWithRetry'

/**
 * Readiness: доступен ли upstream (1С) — для мониторинга.
 * Любой HTTP-ответ от API считается достижимостью (DNS + сеть + процесс).
 * Логируем только endpoint, код ошибки и длительность — без тел и заголовков.
 */
export async function GET() {
  const baseUrl = (process.env.API_1C_URL || 'https://api1.krasrm.com').replace(/\/+$/, '')
  const target = `${baseUrl}/api/`
  const startedAt = Date.now()

  try {
    const response = await fetchWithRetry(target, {
      method: 'GET',
      cache: 'no-store',
    }, {
      timeoutMs: 3000,
      budgetMs: 3000,
      retries: 0,
    })

    // Тело не читаем — нам нужен только факт HTTP-ответа
    response.body?.cancel()

    return Response.json({
      status: 'ready',
      upstream: 'ok',
      upstreamStatus: response.status,
      durationMs: Date.now() - startedAt,
    })
  } catch (error) {
    const code = (error as { cause?: { code?: string }; code?: string })
    const safeCode = code?.code || code?.cause?.code || 'network-error'

    console.warn(
      `[health/ready] upstream unavailable: ${safeCode} after ${Date.now() - startedAt}ms`
    )

    return Response.json(
      {
        status: 'degraded',
        upstream: 'unavailable',
        durationMs: Date.now() - startedAt,
      },
      { status: 503 }
    )
  }
}
