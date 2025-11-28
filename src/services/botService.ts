import { axiosInstance } from '../api/apiClient'

enum Endpoint {
  IA = '/ia'
}

class BotService {
  static async chat(message: string) {
    const response = await axiosInstance.post(Endpoint.IA, {
      reply: message
    })
    return response.data
  }
}

export { BotService }
