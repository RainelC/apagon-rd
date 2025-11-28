import { getToken } from '@utils/authStorage'
import axios from 'axios'
const axiosInstance = axios.create({
  baseURL: 'http://3.142.230.203:8020/api/v1/',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
})

axiosInstance.interceptors.request.use(async (config) => {
  if(config.url?.includes('/auth/token')) return config
  const token = await getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export { axiosInstance }

