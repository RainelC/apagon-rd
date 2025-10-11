import axios from '../api/apiClient'
import type { CreateUser } from '../types/createUser'

enum Endpoint {
  REGISTER = 'users/register',
  LOGIN = 'auth/token',
  RECOVER_PASSWORD = 'account/recover',
  CHANGE_PASSWORD = 'account/recover/change',
  SEND_RECUPERATION_EMAIL = 'account/recover/send'
}

class AuthService {
  async register(user: CreateUser) {
    const { statusText, data } = await axios.post(
      Endpoint.REGISTER,
      {
        ...user
      }
    )

    if (statusText !== 'OK')
      throw new Error(
        'Error al registrar el usuario',
        data.message
      )

    return true
  }

  async login(username: string, password: string) {
    const { data, status } = await axios.post(
      Endpoint.LOGIN,
      {},
      {
        headers: {
          Authorization:
            'Basic ' + btoa(username + ':' + password)
        }
      }
    )

    if (status !== 200) {
      throw new Error('Error al iniciar sesion')
    }

    return data
  }
}

export { AuthService }
