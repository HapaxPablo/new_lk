import { OrganizationForm } from '@/types/olf'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // достаём параметр ?type=...

    if (!type) {
      return NextResponse.json(
        { error: 'Missing "type" query parameter' },
        { status: 400 }
      )
    }

    const apiUrl = `${process.env.API_1C_URL}/getOrganizationForms?type=${type}`
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const data: OrganizationForm[] = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching OPF:', error)
    return NextResponse.json({ error: 'Failed to fetch OPF' }, { status: 500 })
  }
}
