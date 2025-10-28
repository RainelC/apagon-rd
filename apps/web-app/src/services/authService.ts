import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: 'http://52.15.179.101:8020/api/v1',
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
    datas: recoverPasswdProps
  ): Promise<number> {
    const { status} = await axiosInstance.post(
      '/account/recover',
      datas
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
