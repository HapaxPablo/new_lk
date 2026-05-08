import { EcommerceTracker } from "@/components/ecommerce/EcommerceTracker"
import Toolbar from "@/components/toolbar/Toolbar"
import LoaderSkeleton from "@/components/ui/loader/LoaderSkeleton"
import { IBrandListResponse } from "@/types/brands"
import { Metadata } from "next"
import dynamic from "next/dynamic"

interface BrandsPageProps {
    searchParams: Promise<{
        limit?: string
        offset?: string
    }>
}


export async function generateMetadata(
    props: BrandsPageProps
): Promise<Metadata> {
    return {
        title: 'Бренды | Личный кабинет',
        description: 'Список брендов',
    }
}

const BrandWrapper = dynamic(
    () =>
        import('../../../components/brands/BrandsWrapper').then(
            (mod) => ({
                default: mod.BrandsWrapper,
            })
        ),
    {
        ssr: true,
        loading: () => <LoaderSkeleton />,
    }
)

export default async function BrandsPage(props: BrandsPageProps) {
    const searchParams = await props.searchParams
    const limit = Number(searchParams.limit) || 15
    const offset = Number(searchParams.offset) || 0

    try {
        const url = new URL('/api/brands/assigned', process.env.API_1C_URL)
        url.searchParams.set('limit', String(limit))
        url.searchParams.set('offset', String(offset))

        console.log('Making request to:', url.toString())

        const response = await fetch(url.toString(), { cache: 'force-cache' })

        if (!response.ok) {
            throw new Error(`Ошибка ${response.status}: ${response.statusText}`)
        }

        const data: IBrandListResponse = await response.json()

        return (
            <>
                <EcommerceTracker
                    item={{
                        item_id: 'brands-list',
                        item_name: 'Список брендов',
                        price: '',
                    }}
                />
                <div className="flex flex-col h-full w-full p-1 gap-2">
                    <h1 className="text-xl! md:text-2xl ml-4 font-semibold mb-3">
                        Выберите бренды для вашей радио-рекламы
                    </h1>
                    <div className="grow min-h-0 overflow-hidden">
                        <div className="h-full">
                            <BrandWrapper
                                brandData={data.results}
                                count={data.count}
                                limit={limit}
                                offset={offset}
                            />
                        </div>
                    </div>
                </div>
            </>
        )
    } catch (error) {
        console.error('Error fetching nomenclatures:', error)
        if (error instanceof Error) {
            throw error
        } else {
            throw new Error('Произошла неизвестная ошибка')
        }
    }

}