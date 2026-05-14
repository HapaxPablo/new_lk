import { LoginWrapper } from '@/components/auth/login/LoginWrapper'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Вход в аккаунт',
  description: 'Страница для входа в аккаунт RMC',
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
}

const page = async () => {
  return <LoginWrapper />
}
export default page
