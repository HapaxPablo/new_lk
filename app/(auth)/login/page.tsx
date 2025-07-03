import { LoginWrapper } from '@/components/auth/LoginWrapper'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Вход в аккаунт',
  description: 'Страница для входа в аккаунт RMC',
}

const page = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      <div className="flex flex-col w-full gap-1 h-full">
        <LoginWrapper />
      </div>
    </div>
  )
}
export default page
