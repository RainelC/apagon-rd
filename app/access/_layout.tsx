import { Tabs } from 'expo-router'

export default function AccessLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={() => null}
    />
  )
}
