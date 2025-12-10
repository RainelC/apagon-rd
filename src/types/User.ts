interface User {
  id: number
  createdAt: string
  updatedAt: string
  username: string
  email: string
  firstName: string
  lastName: string
  status: string
}

interface updateUser {
  username?: string
  email?: string
  firstname?: string
  lastname?: string
}

export type { User, updateUser }
