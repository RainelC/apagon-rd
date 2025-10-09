import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: 'http://52.15.179.101:8020/api/v1',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Chic@s, si necesitan algún interceptor, lo hacen desde aquí. Thanks !

export default axiosInstance
