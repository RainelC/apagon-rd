import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: 'https://api.apagon-rd.resqpet.online/api/v1/',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Chic@s, si necesitan algún interceptor, lo hacen desde aquí. Thanks !

export default axiosInstance
