export interface AuthResponse {
  isAuthorized: boolean;
  emailIsExit: boolean;
  message: string;
  role: string;
  xrmcCookie: string;
  timeout: number;
}