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
    data: recoverPasswdProps
  ): Promise<void> {
    const response = await axiosInstance.post(
      '/account/recover',
      data
    )
    console.log('response: ', response)
  },

  async sendRecoverEmail(data: sendEmailProps): Promise<void> {
    const response = await axiosInstance.post(
      '/account/recover/send',
      { username: data }
    )
    console.log('response: ', response)
  }
}

export default AuthService
