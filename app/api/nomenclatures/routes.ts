import { httpClient1C } from '@/lib/api/HttpClient1C'
import { NextResponse } from 'next/server'

// GET /api/nomenclatures
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const data = await httpClient1C.get('/nomenclatures?' + searchParams.toString())
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// POST /api/nomenclatures (с файлом)
export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    const result = await httpClient1C.uploadFile('/nomenclatures/upload', file)
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { error: 'File upload failed' },
      { status: 500 }
    )
  }
}


// GET /api/nomenclatures/[id]/media - получение медиафайла
// нужно подумать возможно стоит разделить маршруты для получения типов файлов  
// например урл не `/nomenclatures/${params.id}/media`, а `/nomenclatures/${params.id}/img`
export async function GETMEDIA(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // 1. Получаем медиафайлы из 1С
    const mediaBlob = await httpClient1C.getMedia(`/nomenclatures/${params.id}/media`)
    
    // 2. Определяем Content-Type на основе URL или данных
    const contentType = await determineContentType(
      `/nomenclatures/${params.id}/media`,
      mediaBlob
    )
    
    // 3. Возвращаем ответ
    return new NextResponse(mediaBlob, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=604800' // Кешируем на 7 дней
      }
    })
  } catch (error) {
    console.error('Media fetch error:', error)
    return NextResponse.json(
      { error: 'Media not found' },
      { status: 404 }
    )
  }
}

// Вспомогательная функция для определения типа контента
async function determineContentType(
  endpoint: string,
  data: Blob | ArrayBuffer
): Promise<string> {
  // Если пришел ArrayBuffer, создаем из него Blob для определения типа
  const blob = data instanceof ArrayBuffer 
    ? new Blob([data]) 
    : data

  // 1. Попробуем определить по расширению в URL
  if (endpoint.endsWith('.jpg') || endpoint.endsWith('.jpeg')) {
    return 'image/jpeg'
  }
  if (endpoint.endsWith('.png')) {
    return 'image/png'
  }
  if (endpoint.endsWith('.mp3')) {
    return 'audio/mpeg'
  }
  if (endpoint.endsWith('.mp4')) {
    return 'video/mp4'
  }
  
  // 2. Если не определили по URL, пробуем определить из Blob
  if (blob.type && blob.type !== 'application/octet-stream') {
    return blob.type
  }
  
  // 3. Дефолтный тип
  return 'application/octet-stream'
}