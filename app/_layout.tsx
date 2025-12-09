import {
  AuthContext,
  AuthProvider
} from '@context/AuthContext'
import {
  ThemeProvider,
  useTheme
} from '@context/ThemeContext'
import * as Linking from 'expo-linking'
import * as NavigationBar from 'expo-navigation-bar'
import { Href, Redirect, Tabs } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useContext, useEffect } from 'react'
import { Platform } from 'react-native'

function ThemedStatusBar() {
  const { isDarkMode } = useTheme()
  return <StatusBar style={isDarkMode ? 'light' : 'dark'} />
}

function RootLayoutNav() {
  const auth = useContext(AuthContext)

  /// We have to test this fuctions with the apk
  async function getInitialDeepLink() {
    const url = await Linking.getLinkingURL()
    if (url) {
      console.log('App launched with URL:', url)
      return <Redirect href={url as Href} />
    }
    return null
  }

  getInitialDeepLink()

  if (auth?.loading) return null
  if (!auth?.token)
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
