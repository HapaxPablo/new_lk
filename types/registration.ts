export interface RegistrationRequest {
  email: string
  organizationName?: string
  firstname: string
  surname: string
  patronymic?: string
  password: string
  olf: string
  brand: string
  inn: string
  phone: string
}

export interface RegistrationResponse {
  result: boolean
  message: string
  validationErrors: {
    email: boolean
    organizationName?: boolean
    firstname: boolean
    surname: boolean
    patronymic?: boolean
    password: boolean
    olf: boolean
    brand: boolean
    inn: boolean
    phone: boolean
  }
}
