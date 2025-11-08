import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: 'https://api.apagon-rd.resqpet.online/api/v1/',
  headers: {
    'Content-Type': 'application/json'
  }
})

interface recoverPasswdProps {
  password: string
  repeated: string
  token: string
}

interface sendEmailProps {
  username: string
}

const AuthService = {
  async recoverPasswd(
    data: recoverPasswdProps
  ): Promise<number> {
    const { status } = await axiosInstance.post(
      '/account/recover',
      data
    )
    return status
  },

  async validateRecoverToken(token: string) {
    const { data } = await axiosInstance.post(
      '/account/recover/validate?token=' + token,
      {}
    )
    return data.result
  },

  async sendRecoverEmail(
    props: sendEmailProps
  ): Promise<number> {
    const { status } = await axiosInstance.post(
      '/account/recover/send',
      props
    )
    return status
  }
}

export default AuthService
