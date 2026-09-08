/**
 * fetch с таймаутами и ретраями для транзиентных сетевых ошибок.
 *
 * Ретраим только когда запрос вообще не дошёл до сервера:
 * DNS (EAI_AGAIN, ENOTFOUND), обрывы соединения, таймауты.
 * HTTP-ошибки (4xx/5xx) и ответ с телом НЕ ретраятся.
 *
 * Правила (production-performance-fix-plan.md):
 * - у каждой попытки свой таймаут, у всего запроса — общий бюджет;
 * - максимум один повтор, и только для read-only операций
 *   (GET/HEAD или POST с флагом readOnly — поиск, карта);
 * - логируем только endpoint, статус/код ошибки, длительность.
 *   Тела, заголовки, cookie, токены — никогда.
 *
 * Появилось после переезда на новый хост: DNS контейнера периодически
 * отвечает EAI_AGAIN, и SSR-страницы падают без единого шанса на повтор.
 */

const DEFAULT_TIMEOUT_MS = 8000
const DEFAULT_BUDGET_MS = 12000
const DEFAULT_DELAYS_MS = [500]
const MAX_RETRIES = 1

const RETRYABLE_CODES = new Set([
  'EAI_AGAIN',
  'ENOTFOUND',
  'ECONNRESET',
  'ECONNREFUSED',
  'ETIMEDOUT',
  'EPIPE',
  'EHOSTUNREACH',
  'ENETUNREACH',
  'UND_ERR_SOCKET',
  'UND_ERR_CONNECT_TIMEOUT',
])

export interface FetchWithRetryOptions {
  /** Таймаут одной попытки в мс. 0 — без ограничения. По умолчанию 8000. */
  timeoutMs?: number
  /** Общий бюджет всех попыток в мс. 0 — без ограничения. По умолчанию 12000. */
  budgetMs?: number
  /**
   * Максимум попыток-повторов (не считая первую). Ограничено одним.
   * По умолчанию: 1 для read-only запросов, 0 для остальных.
   */
  retries?: number
  /**
   * True, если POST — безопасная read-only операция (поиск, карта).
   * Без флага POST ретраится никогда.
   */
  readOnly?: boolean
  /** Паузы между попытками в мс. По умолчанию [500]. */
  delays?: number[]
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/** true, если ошибка похожа на сетевой сбой до получения ответа. */
export function isTransientNetworkError(error: unknown): boolean {
  let current: unknown = error

  for (let depth = 0; current && depth < 5; depth += 1) {
    if (current instanceof Error) {
      // наш собственный аборт по таймауту
      if (current.name === 'TimeoutError' || current.name === 'AbortError') {
        return true
      }

      const code = (current as Error & { code?: unknown }).code
      if (typeof code === 'string' && RETRYABLE_CODES.has(code)) {
        return true
      }

      // undici оборачивает сетевые сбои в TypeError: fetch failed
      if (
        current instanceof TypeError &&
        /fetch failed|network socket disconnected/i.test(current.message)
      ) {
        return true
      }
    }

    current = (current as { cause?: unknown }).cause
  }

  return false
}

function errorCode(error: unknown): string {
  let current: unknown = error

  for (let depth = 0; current && depth < 5; depth += 1) {
    if (current instanceof Error) {
      const code = (current as Error & { code?: unknown }).code
      if (typeof code === 'string') return code
      if (current.name && current.name !== 'Error') return current.name
    }

    current = (current as { cause?: unknown }).cause
  }

  return 'unknown'
}

function describeTarget(input: RequestInfo | URL): string {
  const rawTarget = input instanceof Request ? input.url : String(input)

  try {
    const url = new URL(rawTarget, 'http://local')
    return url.origin === 'http://local'
      ? url.pathname
      : `${url.origin}${url.pathname}`
  } catch {
    return rawTarget.split(/[?#]/, 1)[0]
  }
}

function isReadOnlyRequest(
  method: string | undefined,
  readOnly?: boolean
): boolean {
  const normalized = (method || 'GET').toUpperCase()
  if (readOnly) return true
  return normalized === 'GET' || normalized === 'HEAD'
}

/**
 * Обычный fetch, но с таймаутом на попытку, общим бюджетом и одним
 * повтором для read-only операций при транзиентных сетевых сбоях.
 */
export async function fetchWithRetry(
  input: RequestInfo | URL,
  init?: RequestInit,
  options: FetchWithRetryOptions = {}
): Promise<Response> {
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS
  const budgetMs = options.budgetMs ?? DEFAULT_BUDGET_MS
  const delays =
    options.delays && options.delays.length > 0
      ? options.delays
      : DEFAULT_DELAYS_MS
  const maxRetries = Math.min(
    options.retries ??
      (isReadOnlyRequest(init?.method, options.readOnly) ? 1 : 0),
    MAX_RETRIES
  )

  const startedAt = Date.now()
  const target = describeTarget(input)
  const method = (init?.method || 'GET').toUpperCase()
  let lastError: unknown

  for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
    const elapsed = Date.now() - startedAt
    const remainingBudget =
      budgetMs > 0 ? budgetMs - elapsed : Number.POSITIVE_INFINITY

    if (remainingBudget <= 0) {
      throw lastError instanceof Error
        ? lastError
        : new Error(`fetch budget exceeded: ${method} ${target}`)
    }

    const attemptTimeout =
      timeoutMs > 0 ? Math.min(timeoutMs, remainingBudget) : 0

    const controller = new AbortController()
    const callerSignal = init?.signal
    const abortFromCaller = () => controller.abort(callerSignal?.reason)
    let timeoutId: ReturnType<typeof setTimeout> | undefined

    if (callerSignal?.aborted) {
      abortFromCaller()
    } else {
      callerSignal?.addEventListener('abort', abortFromCaller, { once: true })
    }

    if (attemptTimeout > 0) {
      const timeoutReason = new Error('fetch timeout')
      timeoutReason.name = 'TimeoutError'
      timeoutId = setTimeout(() => {
        controller.abort(timeoutReason)
      }, attemptTimeout)
    }

    try {
      return await fetch(input, {
        ...init,
        signal: controller.signal,
      })
    } catch (error) {
      lastError = error
      const durationMs = Date.now() - startedAt
      const code = errorCode(error)

      const canRetry =
        attempt < maxRetries &&
        !callerSignal?.aborted &&
        isTransientNetworkError(error) &&
        (budgetMs <= 0 || Date.now() - startedAt < budgetMs)

      if (!canRetry) {
        if (attempt === 0) {
          console.warn(
            `[fetch-retry] ${code} ${method} ${target} failed after ${durationMs}ms — no retry`
          )
        }

        throw error
      }

      const delay = delays[Math.min(attempt, delays.length - 1)]
      console.warn(
        `[fetch-retry] ${code} ${method} ${target} attempt ${attempt + 1} in ${durationMs}ms — retry ${attempt + 1}/${maxRetries} in ${delay}ms`
      )
      await sleep(delay)
    } finally {
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId)
      }
      callerSignal?.removeEventListener('abort', abortFromCaller)
    }
  }

  throw lastError
}
