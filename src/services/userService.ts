import { axiosInstance } from '../api/apiClient'
import type { updateUser, User } from '../types/User'

class UserService {
  async getCurrentUser(): Promise<User> {
    const { data } = await axiosInstance.get<User>(
      '/users/current'
    )
    return data
  }

  async updateProfile(user: updateUser) {
    const { data } = await axiosInstance.put(
      '/users/profile',
      user
    )
    return data
  }
}

export const userService = new UserService()
