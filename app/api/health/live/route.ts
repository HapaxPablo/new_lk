/**
 * Liveness: Next.js работает. Не ходит на 1С — сбой upstream не должен
 * приводить к рестарту контейнера.
 */
export async function GET() {
  return Response.json({ status: 'ok' })
}
