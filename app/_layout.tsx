import {
  ThemeProvider,
  useTheme
} from '@context/ThemeContext'
import { AuthProvider } from '@context/AuthContext'
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

export default function RootLayout() {
  useEffect(() => {
    if (Platform.OS === 'android')
      NavigationBar.setStyle('dark')
  }, [])

  return (
    <ThemeProvider>
      <AuthProvider>
        <ThemedStatusBar />
        <RootLayoutNav />
        <Tabs
          screenOptions={{ headerShown: false }}
          tabBar={() => null}
        />
      </AuthProvider>
    </ThemeProvider>
  )
}
