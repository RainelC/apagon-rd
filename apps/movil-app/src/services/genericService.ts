import axiosInstance from '../api/apiClient'

export default class GenericService<T> {
  endpoint: string
  constructor(endpoint: string) {
    this.endpoint = endpoint
  }

  async getAll(): Promise<T[]> {
      const response = await axiosInstance.get(
        this.endpoint
      )
      return response.data
  }

  async getOne(id: string): Promise<T> {
      const response = await axiosInstance.get(
        `${this.endpoint}/${id}`
      )
      return response.data
  }

  async delete(id: string): Promise<unknown> {
      const response = await axiosInstance.delete(
        `${this.endpoint}/${id}`
      )
      return response.status
  }

  async edit(data: T, id: string): Promise<T> {
    const response = await axiosInstance.put(
      `${this.endpoint}/${id}`,
      data
    )
    return response.data
  }
}
