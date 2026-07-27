export interface IRegistrationConfirmResponse {
  isAuthorized: boolean
  emailIsExit: boolean
  message: string
  role: string
  xrmcCookie: {
    accessToken: string
    refreshToken: string
  }
  timeout: number
}
