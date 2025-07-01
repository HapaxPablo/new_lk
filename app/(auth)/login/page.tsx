import Link from 'next/link'

const page = () => {
  return (
    <div className="flex flex-col items-center w-full">
      <form
        className="flex flex-col items-center w-full gap-4 p-0 m-0"
        // onSubmit={(e) => {
        //   e.preventDefault()
        //   // POST()
        // }}
      >
        <div className="font-bold text-4xl">Вход</div>
        <input
          name="email"
          type="email"
          placeholder="Почта"
          className="p-2 border rounded"
          required
          // value={email}
          // onChange={(e) => setEmail(e.target.value)}
        />
        <input
          name="password"
          type="password"
          placeholder="Пароль (мин. 6 символов)"
          className="p-2 border rounded"
          required
          // value={password}
          // onChange={(e) => setPassword(e.target.value)}
        />
        <div className="text-gray-500 flex justify-end w-full">
          Забыл пароль
        </div>
        <div className="w-full bg-[var(--main-text-color)] color-white">
          Войти
        </div>
      </form>
      <div>
        Еще нет аккаунта? <Link href="/register">Регистрации</Link>
      </div>
    </div>
  )
}
export default page
