import { httpClient1CServer } from '@/lib/http-client/httpServer'
import { cookies } from 'next/headers'
import { IAdOrderDetail, IBgOrderDetail } from '@/types/orders'

export async function getAdOrderDetail(id: string): Promise<IAdOrderDetail> {
  const cookieStore = await cookies()
  return httpClient1CServer.get<IAdOrderDetail>(
    cookieStore,
    `api/adorders/${id}/`
  )
}

export async function getBgOrderDetail(id: string): Promise<IBgOrderDetail> {
  const cookieStore = await cookies()
  return httpClient1CServer.get<IBgOrderDetail>(
    cookieStore,
    `api/bgorders/${id}/`
  )
}
