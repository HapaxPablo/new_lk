import { httpClient1CServer } from "@/lib/http-client/httpServer"
import { IBrandNomenclatureListResponse } from "@/types/brands"
import { Metadata } from "next"
import { cookies } from "next/headers"
import BreadcrumbsSetter from "@/components/ui/breadcrumbs/BreadcrumbsSetter"
import { Hero } from "../components/Hero"
import { Breadcrumbs } from "../components/Breadcrumbs"
import { Intro } from "../components/Intro"
import { PlacesListing } from "../components/PlacesListing"
import { Formats } from "../components/Formats"
import { Benefits } from "../components/Benefits"
import { Audience } from "../components/Audience"
import { Pricing } from "../components/Pricing"
import { Steps } from "../components/Steps"
import { CTA } from "../components/CTA"
import { SEOText } from "../components/SEOText"
import { FAQ } from "../components/FAQ"
import { ICitiesResponse } from "@/types/cities"
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd"

interface PlacesPageProps {
    params: Promise<{
        slug: string
    }>
}

async function getCityData(slug: string): Promise<{ name: string } | null> {
    try {
        const cookieStore = await cookies()
        const response = await httpClient1CServer.get<{ name: string }>(
            cookieStore,
            `api/cities/${slug}`
        )
        return response
    } catch (error) {
        console.error('Error fetching city name:', error)
        return null
    }
}

export async function generateMetadata(props: PlacesPageProps): Promise<Metadata> {
    const city = await getCityData((await props.params).slug)
    const cityName = city?.name || 'города'
    return {
        title: `Indoor реклама в торговых центрах и магазинах в ${cityName} | «RMC»`,
        description: `Размещение индор рекламы в магазинах и торговых центрах в ${city?.name}. Звуковая и видео реклама внутри помещений. Звоните: ☎ 8 800 222 59 38`,
    }
}

async function PlacesCityPage(props: PlacesPageProps) {
    const params = await props.params
    const slug = params.slug || ''

    try {
        const cookieStore = await cookies()

        const data = await httpClient1CServer.get<ICitiesResponse>(
            cookieStore,
            `api/nomenclatures/by-city/${slug}`
        )

        const places = data.nomenclatures
        const minPrice = data.minPrice
        const cityFromResponse = data.city
        console.log('data from API:', data)
        console.log('minPrice from response:', minPrice)

        const breadcrumbItems = [
            { name: 'Главная', url: '/' },
            { name: 'Площадки для рекламы', url: '/nomenclatures' },
            { name: cityFromResponse, url: `/places/${slug}` },
        ]

        return (
            <>
                <BreadcrumbJsonLd items={breadcrumbItems} />
                <BreadcrumbsSetter title={`Размещение рекламы в ${cityFromResponse}`} />
                <div className="bg-slate-50 text-slate-900 overflow-auto">


                    {/* <BreadcrumbJsonLd items={breadcrumbItems} /> */}

                    {/* <Breadcrumbs cityName={cityFromResponse} /> */}
                    <Hero cityName={cityFromResponse} placesCount={places.length} minPrice={minPrice} />
                    <Intro cityName={cityFromResponse} />
                    <PlacesListing cityName={cityFromResponse} places={places} />
                    <Formats />
                    <Benefits />
                    <Audience cityName={cityFromResponse} />
                    <Pricing cityName={cityFromResponse} />
                    <Steps cityName={cityFromResponse} />
                    <CTA cityName={cityFromResponse} />
                    <SEOText cityName={cityFromResponse} />
                    <FAQ cityName={cityFromResponse} />
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

export default PlacesCityPage
