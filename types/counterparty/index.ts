export interface ICounterparty {
  id: string
  name: string
  code1c?: string
  created?: string
  is_deleted?: boolean
}

export interface ICounterpartyResponse {
  results: ICounterparty[]
  count: number
  next: string | null
  previous: string | null
}