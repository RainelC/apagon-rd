import { Stack, Redirect } from 'expo-router'
import {
  AuthProvider,
  AuthContext
} from '../src/context/AuthContext'
import { StatusBar } from 'react-native'
import { useEffect, useContext } from 'react'

function RootLayoutNav() {
  const auth = useContext(AuthContext)

  if (auth?.loading) return null

  if (!auth?.token) {
    return <Redirect href='/access/login' />
  }

  return <Redirect href='/(protected)' />
}

export default function RootLayout() {
  useEffect(() => {
    console.log('RootLayout mounted')
    // buscar en el storage el token
  }, [])
  return (
    <AuthProvider>
      <StatusBar barStyle='dark-content' />
      <RootLayoutNav />
      <Stack
        screenOptions={{ headerShown: false }}
        initialRouteName='access/register'
      >
        <Stack.Screen
          name='index'
          options={{ headerShown: false }}
        />
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
      </Stack>
    </AuthProvider>
  )
}
