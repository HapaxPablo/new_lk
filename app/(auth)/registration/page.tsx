import { Metadata } from 'next'

import { RegistrationWrapper } from '@/components/auth/register/RegisterFormWrapper'
export const metadata: Metadata = {
  title: 'Регистрация | Личный кабинет',
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
}
const page = async () => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      <div className="flex flex-col w-full gap-1 h-full justify-center">
        <RegistrationWrapper />
      </div>
    </div>
  )
}
export default page
