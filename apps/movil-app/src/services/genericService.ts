import axiosInstance from '../api/apiClient';

export default class GenericService<T> {
  endpoint: string;
  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  async getAll(): Promise<T[]> {
    try {
      const response = await axiosInstance.get(this.endpoint);
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getOne(id: string): Promise<T> {
    try {
      const response = await axiosInstance.get(`${this.endpoint}/${id}`);
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async delete(id: string): Promise<unknown> {
    try {
      const response = await axiosInstance.delete(`${this.endpoint}/${id}`);
      return response.status;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async edit(data: T, id: string): Promise<T> {
    const response = await axiosInstance.put(`${this.endpoint}/${id}`, data);
    return response.data;
  }
}
