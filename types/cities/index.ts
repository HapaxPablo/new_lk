export interface ICity {
  id: string
  nameForFront: string
  formattedAddress: {
    name: string | null
    coordinates: {
      latitude: string | null
      longitude: string | null
    }
  }
  pricePerMonth: string
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
