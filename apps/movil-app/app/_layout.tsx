import { Stack } from 'expo-router'
import { StatusBar } from 'react-native'

export default function RootLayout() {
  return (
    <>
      <StatusBar barStyle='dark-content' />
      <Stack initialRouteName='access/register'>
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
          options={{ title: 'Crear Cuenta', headerShown: false }}
        />
      </Stack>
    </>
  )
}
