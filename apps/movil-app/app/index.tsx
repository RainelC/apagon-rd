import { router } from 'expo-router'
import { useEffect } from 'react'
import { View, Text } from 'react-native'

export default function Index() {
  useEffect(() => {
    router.replace('/access/register')
  }, [])

  return (
    <View>
      <Text>index</Text>
    </View>
  )
}
