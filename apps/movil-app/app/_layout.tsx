import { Redirect, Tabs } from 'expo-router'
import {
  AuthProvider,
  AuthContext
} from '@context/AuthContext'
import { useContext, useEffect } from 'react'
import * as NavigationBar from 'expo-navigation-bar'
import { Platform } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import * as Linking from 'expo-linking'

function RootLayoutNav() {
  const auth = useContext(AuthContext)

    /// We have to test this fuctions with the apk
    async function getInitialDeepLink() {
    const url = await Linking.getLinkingURL()
    console.log(url)
    console.log(await Linking.getInitialURL())
    if (url) {
      console.log('App launched with URL:', url)
      return <Redirect href={url}/>
    } else {
      console.log('App not launched by a deep link.')
    }
  }

  getInitialDeepLink()


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
