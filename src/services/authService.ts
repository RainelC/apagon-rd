import { AxiosError, AxiosResponse } from 'axios'
import { axiosInstance } from '../api/apiClient'
import type { CreateUser } from '../types/createUser'
import type recoverPasswdProps from '../types/recover'

enum Endpoint {
  REGISTER = 'users/register',
  LOGIN = 'auth/token',
  RECOVER_PASSWORD = 'account/recover',
  CHANGE_PASSWORD = 'account/recover/change',
  SEND_RECUPERATION_EMAIL = 'account/recover/send',
  VALIDATE_RECOVER_TOKEN = 'account/recover/validate?token='
}

class AuthService {
  async register(user: CreateUser) {
    await axiosInstance
      .post(Endpoint.REGISTER, {
        ...user
      })
      .catch(err => {
        let message = 'Error al registrar el usuario'
        if (err instanceof AxiosError) {
          if (
            err.response?.data.message.includes("Duplicate entry 'ID_CARD-")
          ) {
            message = 'La cédula ya está registrada'
          } else {
            message = err.response?.data.message
          }
        }
        throw new Error(message)
      })
  }

  async login(username: string, password: string) {
    const { data } = await axiosInstance
      .post(
        Endpoint.LOGIN,
        {},
        {
          headers: {
            Authorization: `Basic ${btoa(`${username}:${password}`)}`
          }
        }
      )
      .catch(err => {
        let message = 'Error al iniciar sesión'
        if (err instanceof AxiosError) {

          if (err.response?.status === 401) {
            message = 'Credenciales inválidas'
          } else {
            message = err.response?.data.message
          }
        }
        throw new Error(message)
      })

    return data
  }

  async sendRecoverPasswd(
    username: string
  ): Promise<AxiosResponse | AxiosError> {
    try {
      return await axiosInstance.post(Endpoint.SEND_RECUPERATION_EMAIL, {
        username: username
      })
    } catch (error: unknown) {
      return error as AxiosError
    }
  }

  async recoverPasswd(
    data: recoverPasswdProps
  ): Promise<AxiosResponse | AxiosError> {
    try {
      return await axiosInstance.post(Endpoint.RECOVER_PASSWORD, data)
    } catch (error: unknown) {
      return error as AxiosError
    }
  }

  async validateRecoverToken(token: string) {
    const { data } = await axiosInstance.post(
      Endpoint.VALIDATE_RECOVER_TOKEN + token,
      {}
    )
    return data.result
  }
}

export { AuthService }
