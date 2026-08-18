type AdditionalContactType =
  | 'phone'
  | 'mail'
  | 'web'
  | 'messenger'
  | 'address'
  | 'other'
type Vidtel = 'mobkl' | 'dop' | 'mobkldop'
type Vidmail = 'rab' | 'dop' | 'lich'

interface IAdditionalContactInfo {
  basic: boolean
  type?: AdditionalContactType
  vidtel?: Vidtel
  vidmail?: Vidmail
  meaning?: string
  ext?: string
  comment?: string
}

export interface ICurrentUser {
  id: string
  email: string | null
  phone_number: string | null
  first_name: string | null
  last_name: string | null
  middle_name: string | null
  role: string
}

export const EMPLOYEE_ROLES = ['superuser', 'admin', 'manager'] as const

export const USER_ROLE_LABELS: Record<string, string> = {
  ordinary: 'Пользователь',
  broadcast: 'Корпоративное вещание',
  ad: 'Реклама',
  admin: 'Сотрудник ТО',
  manager: 'Менеджер',
  superuser: 'Суперпользователь',
}

export const isEmployeeRole = (role?: string | null): boolean =>
  EMPLOYEE_ROLES.includes(role?.toLowerCase() as (typeof EMPLOYEE_ROLES)[number])

export const getUserFullName = (user: ICurrentUser): string =>
  [user.last_name, user.first_name].filter(Boolean).join(' ') ||
  user.email ||
  'Пользователь'

export interface IUserDetailsItem {
  id: string
  phone_number: string
  role: string
  contacts: IAdditionalContactInfo[]
  code1c?: string
  created: string
  full_name?: {
    first_name?: string
    last_name?: string
    middle_name?: string
    avatar?: string
  }
}

const contactLabel = {
  phone: 'Телефон',
  mail: 'Почта',
  web: 'Веб-страница',
  messenger: 'Мессенджер',
  address: 'Адрес',
  other: 'Другое',
  mobkl: 'Телефон мобильный КЛ',
  dop: 'Дополнительный',
  mobkldop: 'Телефон дополнительный КЛ',
  rab: 'E-mail рабочий КЛ',
  lich: 'E-mail личный',
}

export const contactLabelArray = Object.keys(contactLabel).map((key) => ({
  value: key,
  label: contactLabel[key as keyof typeof contactLabel],
}))
