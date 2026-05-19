import { useDateRange } from '@/hooks/useDateRange'
import { useOrderSubmit } from '@/hooks/useOrderSubmit'
import { createContext, useContext } from 'react'

interface OrderCreateCtx {
    dateRange: ReturnType<typeof useDateRange>
    order: ReturnType<typeof useOrderSubmit>
    mounted: boolean
}

export const OrderCreateContext = createContext<OrderCreateCtx>(null!)

export const useOrderCreate = () => useContext(OrderCreateContext)