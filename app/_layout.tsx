import {
  DARK_COLORS,
  LIGHT_COLORS
} from '@constants/colors'
import { AuthProvider } from '@context/AuthContext'
import {
  ThemeProvider,
  useTheme
} from '@context/ThemeContext'
import { useAuth } from '@hooks/useAuth'
import * as Linking from 'expo-linking'
import * as NavigationBar from 'expo-navigation-bar'
import { Href, Redirect, Tabs } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useEffect } from 'react'
import { ActivityIndicator, Platform } from 'react-native'

function ThemedStatusBar() {
  const { isDarkMode } = useTheme()
  return <StatusBar style={isDarkMode ? 'light' : 'dark'} />
}

function RootLayoutNav() {
  const { loading, token } = useAuth()

  /// We have to test this fuctions with the apk
  async function getInitialDeepLink() {
    const url = Linking.getLinkingURL()
    if (!url) return
    return <Redirect href={url as Href} />
  }

  getInitialDeepLink()

  if (loading) return <ActivityIndicator size='large' />
  if (!token)
    return <Redirect href={'/access/login' as Href} />
  return <Redirect href={'/(protected)' as Href} />
}

function MainLayoutNav() {
  const { isDarkMode } = useTheme()
  const colors = isDarkMode ? DARK_COLORS : LIGHT_COLORS

  return (
    <>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      <ThemedStatusBar />
      <RootLayoutNav />
      <Tabs
        screenOptions={{
          headerShown: false,
          sceneStyle: {
            backgroundColor: colors.background
          }
        }}
        tabBar={() => null}
      />
    </>
  )
}

export default function RootLayout() {
  useEffect(() => {
    if (Platform.OS === 'android')
      NavigationBar.setStyle('dark')
  }, [])

  return (
    <ThemeProvider>
      <AuthProvider>
        <MainLayoutNav />
      </AuthProvider>
    </ThemeProvider>
  )
}
