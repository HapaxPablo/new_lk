import { LoginForm } from '@/components/auth/LoginForm'
import Image from 'next/image'
import Link from 'next/link'

const page = async () => {
  return (
    <div className="flex flex-col md:flex-row md:h-full md:gap-1">
      {/* Левая часть — форма */}
      <div className="flex flex-col items-center justify-center md:max-w-[420px] md:h-full md:justify-around w-full md:w-1/2">
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
            <Link href="/register" className="!text-main-text">
              Регистрация.
            </Link>
          </div>
        </div>
      </div>
      {/* Правая часть — изображение */}
      <div className="relative flex-grow hidden md:flex md:relative">
        <Image
          src="/wall.jpg" //TODO: заменить потом на хотелку антона
          alt="background"
          fill
          loading="lazy"
        />
      </div>
    </div>
  )
}
export default page
