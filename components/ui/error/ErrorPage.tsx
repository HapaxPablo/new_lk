import Image from 'next/image'
interface ErrorProps {
  error: Error
}

export default function ErrorPage({ error }: ErrorProps) {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-4 select-none">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex flex-row w-full justify-center items-center gap-0.5">
          <Image
            src="/alt-logo.svg"
            alt="logo"
            width={240}
            height={80}
            priority
            className="w-60 h-20"
          />
          <div className="flex flex-col flex-wrap text-left uppercase font-bold">
            <span>российская</span>
            <span>мультимедийная</span>
            <span>сеть</span>
          </div>
        </div>
        <div className="space-y-3">
          <h1 className="text-2xl font-bold text-gray-900">
            Ведутся технические работы
          </h1>
          <p className="text-gray-600">
            Извините, что-то пошло не так на нашей стороне. Мы работаем над
            устранением проблемы.
          </p>
          {process.env.NODE_ENV === 'development' && (
            <pre className="text-xs text-left p-3 bg-gray-100 rounded overflow-auto">
              {error.message}
            </pre>
          )}
        </div>

        <div className="space-y-3">
          <p className="">Обновите страницу или вернитесь на главную</p>
          <div className="">
            <p className="">При повторении ошибки свяжитесь с нами:</p>
            <div className="">
              <a
                href="tel:+78002225938"
                className="flex items-center justify-center gap-2"
              >
                <span className="">📞</span>
                <span className="text-[var(--second-text-color)] hover:text-[var(--main-text-color)] transition-colors">
                  +7 (800) 222-59-38
                </span>
              </a>
              <a
                href="mailto:info@krasrm.com"
                className="flex items-center justify-center gap-2"
              >
                <span className="">✉️</span>
                <span className="text-[var(--second-text-color)] hover:text-[var(--main-text-color)] transition-colors">
                  info@krasrm.com
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
