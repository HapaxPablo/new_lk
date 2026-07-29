import { notFound } from 'next/navigation'
import { isValidType } from '../[id]/page'
import { TOrderKind } from '@/types/orders'
import { AdOrderForm } from '@/components/orders/AdOrderForm'
import { BgOrderForm } from '@/components/orders/BgOrderForm'
import { Metadata } from 'next'

interface CreateOrderPageProps {
  params: Promise<{ type: TOrderKind }>
}

export async function generateMetadata({
  params,
}: CreateOrderPageProps): Promise<Metadata> {
  const { type } = await params
  return {
    title: `Создание ${type === 'ad' ? 'рекламного' : 'фонового'} заказа`,
  }
}

export default async function CreateOrderPage({
  params,
}: CreateOrderPageProps) {
  const { type } = await params

  if (!isValidType(type)) {
    notFound()
  }

  return type === 'ad' ? <AdOrderForm /> : <BgOrderForm />
}
