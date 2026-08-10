import { NextRequest } from 'next/server'

interface RouteContext {
  params: Promise<{
    z: string
    x: string
    y: string
  }>
}

const MAX_VECTOR_TILE_ZOOM = 14

function parseTileCoordinate(value: string, max: number) {
  if (!/^\d+$/.test(value)) return null

  const coordinate = Number(value)
  if (!Number.isSafeInteger(coordinate) || coordinate < 0 || coordinate > max) {
    return null
  }

  return coordinate
}

export async function GET(_request: NextRequest, { params }: RouteContext) {
  const { z: zParam, x: xParam, y: yParam } = await params
  const zoom = parseTileCoordinate(zParam, MAX_VECTOR_TILE_ZOOM)

  if (zoom == null) {
    return Response.json({ error: 'Invalid tile zoom' }, { status: 400 })
  }

  const maxCoordinate = 2 ** zoom - 1
  const x = parseTileCoordinate(xParam, maxCoordinate)
  const y = parseTileCoordinate(yParam, maxCoordinate)

  if (x == null || y == null) {
    return Response.json({ error: 'Invalid tile coordinates' }, { status: 400 })
  }

  try {
    const response = await fetch(
      `https://api1.krasrm.com/maps/data/russia/${zoom}/${x}/${y}.pbf`,
      { next: { revalidate: 86400 } }
    )

    if (!response.ok) {
      return Response.json(
        { error: 'Tile is unavailable' },
        { status: response.status }
      )
    }

    return new Response(await response.arrayBuffer(), {
      headers: {
        'Content-Type': 'application/x-protobuf',
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      },
    })
  } catch {
    return Response.json(
      { error: 'Tile service is unavailable' },
      { status: 502 }
    )
  }
}
