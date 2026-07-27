import { NextRequest, NextResponse } from 'next/server'

interface PlaylistCreatePayload {
  name: string
  description: string
  files: string[]
}

export async function POST(request: NextRequest) {
  try {
    const body: PlaylistCreatePayload = await request.json()
    const { name, description, files } = body

    if (typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json(
        { error: 'Поле name обязательно для заполнения' },
        { status: 400 }
      )
    }

    if (!Array.isArray(files) || files.length === 0) {
      return NextResponse.json(
        { error: 'Поле files должно содержать хотя бы один идентификатор' },
        { status: 400 }
      )
    }

    const invalidFileId = files.find(
      (fileId) => typeof fileId !== 'string' || fileId.trim() === ''
    )

    if (invalidFileId) {
      return NextResponse.json(
        { error: 'Каждый файл должен быть строковым UUID' },
        { status: 400 }
      )
    }

    const apiUrl = `${process.env.API_1C_URL}api/playlists/`
    const apiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `access_token ${request.cookies.get('access_token')?.value || ''}`,
        Cookie: `access_token=${request.cookies.get('access_token')?.value || ''}`,
        'User-Agent': request.headers.get('user-agent') || '',
      },
      body: JSON.stringify({ name, description, files }),
    })

    const responseData = await apiResponse.json()

    if (!apiResponse.ok) {
      return NextResponse.json(
        { error: 'Ошибка при создании плейлиста', detail: responseData },
        { status: apiResponse.status }
      )
    }

    return NextResponse.json(responseData, { status: apiResponse.status })
  } catch (error) {
    console.error('Playlist create error:', error)
    return NextResponse.json(
      { error: 'Ошибка при создании плейлиста' },
      { status: 500 }
    )
  }
}
