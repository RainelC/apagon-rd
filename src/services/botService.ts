import { axiosInstance } from '../api/apiClient'
import { Message } from '../types/message'
enum Endpoint {
  IA = '/ia'
}

interface Props {
  reply: string,
  messages: Message[]
}

class BotService {
  static async chat({
    reply,
    messages
  }: Props) {
    const response = await axiosInstance.post(Endpoint.IA, {
      "reply": reply,
      "messages": messages
    })
    return response.data
  }
}

export { BotService }
