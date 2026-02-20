import { NextRequest } from 'next/server'
import { httpClient1CServer } from './httpServer'

export class HttpClient1C {
  // static client() {
  //   return {
  //     get: <T = any>(endpoint: string) => httpClient1CClient.get<T>(endpoint),
  //     post: <T = any>(endpoint: string, data: any) =>
  //       httpClient1CClient.post<T>(endpoint, data),
  //     put: <T = any>(endpoint: string, data: any) =>
  //       httpClient1CClient.put<T>(endpoint, data),
  //     patch: <T = any>(endpoint: string, data: any) =>
  //       httpClient1CClient.patch<T>(endpoint, data),
  //     delete: <T = any>(endpoint: string) =>
  //       httpClient1CClient.delete<T>(endpoint),
  //     upload: <T = any>(endpoint: string, file: File) =>
  //       httpClient1CClient.upload<T>(endpoint, file),
  //   }
  // }

  static server(request: NextRequest) {
    return {
      get: <T = any>(endpoint: string) =>
        httpClient1CServer.get<T>(request, endpoint),
      post: <T = any>(endpoint: string, data: any) =>
        httpClient1CServer.post<T>(request, endpoint, data),
      put: <T = any>(endpoint: string, data: any) =>
        httpClient1CServer.put<T>(request, endpoint, data),
      patch: <T = any>(endpoint: string, data: any) =>
        httpClient1CServer.patch<T>(request, endpoint, data),
      delete: <T = any>(endpoint: string) =>
        httpClient1CServer.delete<T>(request, endpoint),
      upload: <T = any>(endpoint: string, file: File) =>
        httpClient1CServer.upload<T>(request, endpoint, file),
    }
  }
}
