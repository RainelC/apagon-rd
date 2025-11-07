import { Stack, Redirect } from 'expo-router'
import {
  AuthProvider,
  AuthContext
} from '@context/AuthContext'
import { StatusBar } from 'react-native'
import { useContext } from 'react'
import * as Linking from 'expo-linking'

function RootLayoutNav() {
  const auth = useContext(AuthContext)

    async function getInitialDeepLink() {
    const url = await Linking.getLinkingURL()
    console.log(url)
    console.log(await Linking.getInitialURL())
    if (url) {
      console.log('App launched with URL:', url)
      // Handle the deep link URL here
    } else {
      console.log('App not launched by a deep link.')
    }
  }

  // Call the function
  getInitialDeepLink()


  if (auth?.loading) return null
  if (!auth?.token) return <Redirect href='/access/login' />
  return <Redirect href='/(protected)' />
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar barStyle='dark-content' />
      <RootLayoutNav />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name='access/login'
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='access/register'
          options={{
            title: 'Crear Cuenta',
            headerShown: false
          }}
        />
        <Stack.Screen
          name='(protected)/index'
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='auth/recover'
          options={{
            title: 'Recuperar contraseña',
            headerShown: false
          }}
        />
      </Stack>
    </AuthProvider>
  )
}
