export interface IUserDetailsItem {
  id: string
  phone_number: string
  role: string
  additional_contact_info: any
  code1c?: string
  created: string
  full_name?: {
    first_name?: string
    last_name?: string
    middle_name?: string
    avatar?: string
  }
}
