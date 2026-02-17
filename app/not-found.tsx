import Link from 'next/link'
import { Home, Search, AlertCircle } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="relative">
          <div className="w-32 h-32 mx-auto bg-red-100 rounded-full flex items-center justify-center">
            <AlertCircle className="w-20 h-20 text-red-500" />
          </div>
          <div className="absolute -top-2 -right-2 bg-white rounded-full p-3 shadow-lg">
            <span className="text-3xl font-bold text-red-500">404</span>
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-gray-900">
            Страница не найдена
          </h1>
          <p className="text-gray-600">
            Извините, мы не смогли найти страницу, которую вы ищете.
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
          <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
            <Search size={18} />
            Возможные причины:
          </h3>
          <ul className="text-blue-700 space-y-1 text-sm">
            <li>• Страница была перемещена или удалена</li>
            <li>• Вы ввели неправильный URL</li>
            <li>• Страница временно недоступна</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/"
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Home size={20} />
            На главную
          </Link>
        </div>

        <div className="pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-3">Популярные разделы:</p>
          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/nomenclatures"
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Места для рекламы
            </Link>
            <Link
              href="/content"
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Ролики
            </Link>
            <Link
              href="/tasks"
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Задачи
            </Link>
            <Link
              href="/counterparties"
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Контрагенты
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
