import Link from 'next/link'
import Image from 'next/image'
import { IBrandListItem, IBrandListResponse } from '@/types/brands'

interface SimilarBrandsProps {
  excludeSlug: string
}

async function getSimilarBrands(
  excludeSlug: string
): Promise<IBrandListItem[]> {
  try {
    const url = new URL('/api/brands/assigned', process.env.API_1C_URL)
    url.searchParams.set('limit', '8')
    const res = await fetch(url.toString(), { cache: 'no-store' })
    if (!res.ok) return []
    const data: IBrandListResponse = await res.json()
    return (data.results || [])
      .filter((b) => b.slug !== excludeSlug)
      .slice(0, 4)
  } catch {
    return []
  }
}

export async function SimilarBrands({ excludeSlug }: SimilarBrandsProps) {
  const brands = await getSimilarBrands(excludeSlug)
  if (!brands.length) return null

  return (
    <section className="bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-14">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-sm font-bold uppercase tracking-wider text-[#ef5350]">
              Похожие бренды
            </div>
            <h2 className="mt-2 text-3xl font-black text-slate-900">
              Другие бренды рекламных площадок
            </h2>
          </div>
          <Link
            href="/brands"
            className="text-sm font-black text-[#ef5350] hover:text-[#d83c39]"
          >
            Все бренды →
          </Link>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              href={`/brands/${brand.slug}`}
              className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200 hover:ring-[#ef5350]"
            >
              <div className="relative flex h-28 items-center justify-center overflow-hidden rounded-2xl bg-slate-50">
                {brand.logotype ? (
                  <Image
                    src={brand.logotype}
                    alt={brand.name}
                    fill
                    className="object-contain p-3"
                    sizes="200px"
                  />
                ) : (
                  <span className="text-lg font-black text-slate-400">
                    {brand.name}
                  </span>
                )}
              </div>
              <h3 className="mt-4 font-black text-slate-900">{brand.name}</h3>
              <p className="mt-2 text-sm text-slate-500">
                Indoor-реклама и размещение
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
