export interface IUserContacts {
  basic: boolean
  type?: string
  vidmail?: string
  vidtel?: string
  meaning?: string
  ext?: string
  comment?: string
}

export interface IUserDetailsItem {
  id: string
  phone_number: string
  role: string
  contacts: []
  code1c?: string
  created: string
  full_name?: {
    first_name?: string
    last_name?: string
    middle_name?: string
    avatar?: string
  }
}
