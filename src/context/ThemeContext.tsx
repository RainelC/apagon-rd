import AsyncStorage from '@react-native-async-storage/async-storage'
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState
} from 'react'
import { useColorScheme } from 'react-native'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
  isDarkMode: boolean
}

const ThemeContext = createContext<
  ThemeContextType | undefined
>(undefined)

export const ThemeProvider = ({
  children
}: {
  children: ReactNode
}) => {
  const systemScheme = useColorScheme()
  const [theme, setTheme] = useState<Theme>(
    systemScheme === 'dark' ? 'dark' : 'light'
  )

  // Load theme from storage on mount
  useEffect(() => {
    loadTheme()
  }, [])

  // Listen for system theme changes if no user preference is saved
  useEffect(() => {
    checkSystemTheme()
  }, [systemScheme])

  const checkSystemTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme')
      if (!savedTheme) {
        setTheme(systemScheme === 'dark' ? 'dark' : 'light')
      }
    } catch (error) {
      console.error('Error checking system theme:', error)
    }
  }

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme')
      if (savedTheme === 'dark' || savedTheme === 'light') {
        setTheme(savedTheme)
      } else {
        setTheme(systemScheme === 'dark' ? 'dark' : 'light')
      }
    } catch (error) {
      console.error('Error loading theme:', error)
    }
  }

  const toggleTheme = async () => {
    const newTheme: Theme =
      theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    try {
      await AsyncStorage.setItem('theme', newTheme)
    } catch (error) {
      console.error('Error saving theme:', error)
    }
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        isDarkMode: theme === 'dark'
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error(
      'useTheme must be used within a ThemeProvider'
    )
  }
  return context
}
