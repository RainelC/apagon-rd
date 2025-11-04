import { Redirect, Tabs } from 'expo-router'
import {
  AuthProvider,
  AuthContext
} from '@context/AuthContext'
import { useContext, useEffect } from 'react'
import * as NavigationBar from 'expo-navigation-bar'
import { Platform } from 'react-native'
import { StatusBar } from 'expo-status-bar'

function RootLayoutNav() {
  const auth = useContext(AuthContext)

  if (auth?.loading) return null
  if (!auth?.token) return <Redirect href='/access/login' />
  return <Redirect href='/(protected)' />
}

export default function RootLayout() {
  useEffect(() => {
    if (Platform.OS === 'android')
      NavigationBar.setStyle('dark')
  }, [])

  return (
    <AuthProvider>
      <StatusBar style='dark' />
      <RootLayoutNav />
      <Tabs
        screenOptions={{ headerShown: false }}
        tabBar={() => null}
      />
    </AuthProvider>
  )
}
