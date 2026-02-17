'use client'

import NotFound from '@/app/not-found'
import { UserInfoSkeleton } from '../ui/loader/UserInfoSkeleton'
import { useFetchUserById } from '@/lib/api-client/useFetchUserById'
import dynamic from 'next/dynamic'
import { UserInfoContent } from './components/userInfoContent/UserInfoContent'

const LoginForm = dynamic(
  () =>
    import('@/components/auth/login/mobile/LoginFormMobile').then((mod) => ({
      default: mod.LoginFormMobile,
    })),
  { ssr: false, loading: () => <div>Loading...</div> }
)

interface Props {
  userId: string
}

export default function UserInfoModalView({ userId }: Props) {
  console.log('prop userId:', userId)
  const { error, isAuthenticated, isLoading, mutate, userInfo } =
    useFetchUserById(userId)

  if (!userId) return <NotFound />
  if (isLoading) return <UserInfoSkeleton />
  if (!isAuthenticated)
    return (
      <div>
        <LoginForm />
        <div className="text-red-500 mt-2">Пользователь не авторизован.</div>
      </div>
    )
  if (error) return <div className="text-red-500">Ошибка: {error}</div>
  if (!userInfo) return <div>Пользователь не найден</div>

  const fullName = [
    userInfo.full_name?.last_name,
    userInfo.full_name?.first_name,
    userInfo.full_name?.middle_name,
  ]
    .filter(Boolean)
    .join(' ')

  return <UserInfoContent userInfo={userInfo} fullName={fullName} />
}
