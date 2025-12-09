import {
  AuthContext,
  AuthContextType
} from '@context/AuthContext'
import { useContext } from 'react'

// Option 1: Import and re-export the type
export type { AuthContextType }

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error(
      'useAuth must be used within an AuthProvider'
    )
  }
  return context
}
