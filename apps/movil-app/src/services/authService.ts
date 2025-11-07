import { AxiosError, AxiosResponse } from 'axios'
import type { CreateUser } from '../types/createUser'
import { axiosInstance } from '../api/apiClient'

enum Endpoint {
  REGISTER = 'users/register',
  LOGIN = 'auth/token',
  RECOVER_PASSWORD = 'account/recover',
  CHANGE_PASSWORD = 'account/recover/change',
  SEND_RECUPERATION_EMAIL = 'account/recover/send'
}

class AuthService {
  async register(user: CreateUser) {
    const { statusText, data } = await axiosInstance.post(
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
    const { data, status } = await axiosInstance.post(
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

  async sendRecoverPasswd(
    username: string
  ): Promise<AxiosResponse | AxiosError> {
    try {
      return await axiosInstance.post(
        Endpoint.SEND_RECUPERATION_EMAIL,
        {
          username: username
        }
      )
    } catch (error: unknown) {
      return error as AxiosError 
    }
  }
}

export { AuthService }
