import { httpClient1CServer } from '@/lib/http-client/httpServer'
import { getToken } from '@/lib/token/getToken'
import {
  ICreateFile,
  ICreateFileResponse,
  IFileDetailResponse,
  IFilesListResponse,
  ITagResponse,
  ITagsListResponse,
} from '@/types/files'
import { cookies } from 'next/headers'

export async function getFilesList(queryParams: {
  page: number
  limit: number
  name: string
  file_type: string
  tags: string[]
}): Promise<IFilesListResponse> {
  const cookieStore = await cookies()
  const stringifiedQueryParams: Record<string, any> = {
    page: queryParams.page.toString(),
    limit: queryParams.limit.toString(),
    name: queryParams.name.toString(),
    file_type: queryParams.file_type.toString(),
  }

  if (queryParams.tags.length > 0) {
    stringifiedQueryParams.tags = queryParams.tags
  }

  const data = await httpClient1CServer.get<IFilesListResponse>(
    cookieStore,
    `api/files/?${new URLSearchParams(stringifiedQueryParams).toString()}`
  )
  console.log('Data from getFilesList:', data)
  return data
}

export async function sendFile(
  body: ICreateFile
): Promise<ICreateFileResponse> {
  const cookieStore = await cookies()
  try {
    return await httpClient1CServer.post<ICreateFileResponse>(
      cookieStore,
      `api/files/`,
      body
    )
  } catch (error: any) {
    console.error('Ошибка при создании файла:', error)
    throw error
  }
}
// export async function sendFile(
//   body: ICreateFile
// ): Promise<ICreateFileResponse> {
//   const token = await getToken()
//   const url = `${process.env.NEXT_PUBLIC_API_URL}files/`

//   try {
//     return await httpClient1CServer.post<ICreateFileResponse>(url, {
//       headers: {
//         Authorization: `access_token ${token}`,
//       },
//       body: body,
//     })
//   } catch (error: any) {
//     console.error('Ошибка при создании файла:', error)
//     throw error
//   }
// }

// export interface IDeleteFileResponse {
//   success: boolean
//   message?: string
//   error?: string
// }

// export async function deleteFile(id: string): Promise<IDeleteFileResponse> {
//   const token = await getToken()
//   const url = `${process.env.NEXT_PUBLIC_API_URL}files/${id}`
//   try {
//     return await httpClient1CServer.delete<IDeleteFileResponse>(url, {
//       headers: {
//         Authorization: `access_token ${token}`,
//         'Content-Type': 'application/json',
//       },
//     })
//   } catch (error: any) {
//     console.error('Ошибка при удалении файла:', error)
//     throw error
//   }
// }

// export async function addTags(id: string, tags: string[]) {
//   const token = await getToken()

//   const url = `${process.env.NEXT_PUBLIC_API_URL}files/${id}/add_tags/`

//   return await httpClient1CServer.post(url, {
//     headers: {
//       Authorization: `access_token ${token}`,
//     },
//     body: { tags },
//   })
// }

// export async function removeTags(id: string, tags: string[]) {
//   const token = await getToken()

//   const url = `${process.env.NEXT_PUBLIC_API_URL}files/${id}/remove_tags/`

//   return await httpClient1CServer.post(url, {
//     headers: {
//       Authorization: `access_token ${token}`,
//     },
//     body: { tags },
//   })
// }

// export async function getTagList(page: number): Promise<ITagsListResponse> {
//   const token = await getToken()

//   const url = `${process.env.NEXT_PUBLIC_API_URL}tags/?page=${page}`

//   return await httpClient1CServer.get<ITagsListResponse>(url, {
//     headers: {
//       Authorization: `access_token ${token}`,
//     },
//   })
// }

// export async function createTag(name: string): Promise<ITagResponse> {
//   const token = await getToken()
//   const url = `${process.env.NEXT_PUBLIC_API_URL}tags/`

//   return httpClient1CServer.post(url, {
//     headers: {
//       Authorization: `access_token ${token}`,
//     },
//     body: { name },
//   })
// }
