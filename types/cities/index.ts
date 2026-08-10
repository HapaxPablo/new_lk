export interface ICity {
  id: string
  title?: string
  formattedAddress: {
    name: string | null
    coordinates: {
      latitude: string | null
      longitude: string | null
    }
  }
  pricePerMonth: string
  typeOfPlace: string
  exterior: {
    source: string
    id: string
  }[]
  brand: {
    id: string
    name: string
    logotype: string
    slug: string
  }
}

export interface ICitiesResponse {
  minPrice: number
  city: string
  nomenclatures: ICity[]
}

export interface IGetNameCity {
  name: string
}

export interface ICitySitemap {
  id: string
  name: string
  slug: string
  region: string
  region_name?: string
  locality_type: string
  timezone: string | null
  nomenclature_count?: number
}
