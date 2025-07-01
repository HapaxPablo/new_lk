import { LoginForm } from '@/componennts/auth/LoginForm'

const page = async () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Вход в систему</h2>
          <p className="mt-2 text-sm text-gray-600">
            Введите ваш email и пароль
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
export default page
