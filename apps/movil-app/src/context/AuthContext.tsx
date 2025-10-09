import {
  createContext,
  useState,
  useEffect,
  ReactNode
} from 'react'
import {
  getToken,
  saveToken,
  removeToken
} from '../utils/authStorage'

interface AuthContextType {
  // user: any
  token: string | null
  signIn: (token: string) => Promise<void>
  signOut: () => Promise<void>
  loading: boolean
}

export const AuthContext =
  createContext<AuthContextType | null>(null)

export const AuthProvider = ({
  children
}: {
  children: ReactNode
}) => {
  const [token, setToken] = useState<string | null>(null)
  // const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const savedToken = await getToken()
      if (savedToken) setToken(savedToken)
      setLoading(false)
    }
    load()
  }, [])

  const signIn = async (
    newToken: string
    // userData?: any
  ) => {
    await saveToken(newToken)
    setToken(newToken)
    // if (userData) setUser(userData)
  }

  const signOut = async () => {
    await removeToken()
    setToken(null)
    // setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{ token, signIn, signOut, loading }}
    >
      {children}
    </AuthContext.Provider>
  )
}
