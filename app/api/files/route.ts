import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const contentType = (
      request.headers.get('content-type') || ''
    ).toLowerCase()

    // If request is JSON (base64 payload)
    if (contentType.includes('application/json')) {
      const body = await request.json()
      const { source, tags, type } = body

      if (!source) {
        return NextResponse.json(
          { error: 'Поле source обязательно' },
          { status: 400 }
        )
      }

      const apiUrl = `${process.env.API_1C_URL}api/files/`
      const apiResponse = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `access_token ${request.cookies.get('access_token')?.value || ''}`,
          Cookie: `access_token=${request.cookies.get('access_token')?.value || ''}`,
          'User-Agent': request.headers.get('user-agent') || '',
        },
        body: JSON.stringify({ source, tags, type }),
      })

      let responseData: any
      try {
        responseData = await apiResponse.json()
      } catch {
        responseData = null
      }

      if (!apiResponse.ok) {
        return NextResponse.json(
          {
            error: 'Ошибка при загрузке файла',
            detail: responseData || 'Не удалось разобрать ответ сервера',
          },
          { status: apiResponse.status }
        )
      }

      return NextResponse.json(responseData ?? { success: true }, {
        status: apiResponse.status,
      })
    }

    // Fallback to multipart/form-data handling
    const formData = await request.formData()
    const file = formData.get('file')
    const source = formData.get('source')?.toString().trim() || ''

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: 'Файл обязателен для загрузки' },
        { status: 400 }
      )
    }

    if (!source) {
      return NextResponse.json(
        { error: 'Источник файла обязателен' },
        { status: 400 }
      )
    }

    const apiUrl = `${process.env.API_1C_URL}api/files/`
    const apiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        Authorization: `access_token ${request.cookies.get('access_token')?.value || ''}`,
        Cookie: `access_token=${request.cookies.get('access_token')?.value || ''}`,
        'User-Agent': request.headers.get('user-agent') || '',
      },
      body: formData,
    })

    let responseData: any
    try {
      responseData = await apiResponse.json()
    } catch {
      responseData = null
    }

    if (!apiResponse.ok) {
      return NextResponse.json(
        {
          error: 'Ошибка при загрузке файла',
          detail: responseData || 'Не удалось разобрать ответ сервера',
        },
        { status: apiResponse.status }
      )
    }

    return NextResponse.json(responseData ?? { success: true }, {
      status: apiResponse.status,
    })
  } catch (error) {
    console.error('File upload error:', error)
    return NextResponse.json(
      { error: 'Ошибка при загрузке файла' },
      { status: 500 }
    )
  }
}
