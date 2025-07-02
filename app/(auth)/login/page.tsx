import { LoginForm } from '@/components/auth/LoginForm'
import Image from 'next/image'
import Link from 'next/link'

const page = async () => {
  return (
    <div className="flex flex-col items-center justify-center mx-[20px]">
      <div className="flex flex-col w-full gap-[34px]">
        <div className="flex justify-center w-full">
          <Image
            src="/alt-logo.svg"
            alt="logo"
            width={120}
            height={24}
            priority
            className="w-auto h-auto"
          />
        </div>
        <LoginForm />
      </div>
      <div className="flex justify-center w-full">
        <div className="text-gray-500">
          Еще нет аккаунта?{' '}
          <Link href="/register" className="text-[var(--main-text-color)]!">
            Регистрация.
          </Link>
        </div>
      </div>
    </div>
  )
}
export default page
