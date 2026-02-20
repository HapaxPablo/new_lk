// import { useHttpClient } from '@/hooks/useHttpClient'
// import { IUserDetailsItem } from '@/types/user'
// import { useCallback } from 'react'

// interface FetchUserResult {
//   data?: IUserDetailsItem
//   error?: string
// }

// export function useFetchUserById() {
//   const { client, isAuthenticated } = useHttpClient()

//   // мемоизация функции
//   const fetchUserById = useCallback(
//     async (userId: string): Promise<FetchUserResult> => {
//       try {
//         const response = await client.get<IUserDetailsItem>(
//           `/api/users/${userId}`
//         )

//         if (!response) {
//           return { error: 'Нет ответа от сервера.' }
//         }

//         return { data: response }
//       } catch (err: any) {
//         console.error('fetchUserById error:', err)

//         if (err.response?.data?.code) {
//           return { error: 'Неверный токен или он недействителен.' }
//         }

//         if (err.response?.data?.detail) {
//           return { error: 'Не передан заголовок Authorization с access_token.' }
//         }

//         return { error: 'Произошла ошибка при получении данных пользователя.' }
//       }
//     },
//     [client]
//   )

//   return { fetchUserById, isAuthenticated }
// }
import useSWR from 'swr'
import { IUserDetailsItem } from '@/types/user'
import { useHttpClient } from '@/hooks/useHttpClient'

export function useFetchUserById(userId?: string) {
  const { isAuthenticated } = useHttpClient()

  console.log('userId', userId)

  const { data, error, isLoading, mutate } = useSWR<IUserDetailsItem>(
    userId && isAuthenticated ? `/api/users/${userId}` : null // если не авторизован — запрос не идёт
  )

  console.log('data', data)
  console.log('error', error?.message)

  return {
    userInfo: data,
    error: error?.message,
    isLoading,
    isAuthenticated,
    mutate,
  }
}
