type Endpoint =
  | 'users/register'
  | 'auth/token'
  | 'account/recover'
  | 'account/recover/change'
  | 'account/recover/send'

class AuthService {}

export { AuthService }
