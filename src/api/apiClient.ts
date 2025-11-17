import axios from 'axios'
import { getToken } from '@utils/authStorage'

const axiosInstance = axios.create({
  baseURL: 'http://3.142.230.203:8020/api/v1/',
  headers: {
    'Content-Type': 'application/json'
  }
})

axiosInstance.interceptors.request.use(async (config) => {
  const token = await getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export { axiosInstance }
