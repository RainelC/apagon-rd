import { Tabs } from 'expo-router'
import {
  AntDesign,
  Octicons,
  FontAwesome,
  Ionicons
} from '@expo/vector-icons'
import { COLORS } from '@constants/colors'
import { Pressable, PressableProps } from 'react-native'

type TabIconProps = {
  color: string
  size: number
}

const TABS_CONFIG = [
  {
    name: 'index',
    title: 'Inicio',
    icon: (props: TabIconProps) => (
      <AntDesign
        {...props}
        name='home'
        size={24}
      />
    )
  },
  {
    name: 'report',
    title: 'Reportar',
    icon: (props: TabIconProps) => (
      <Octicons
        {...props}
        name='diff-added'
        size={24}
      />
    )
  },
  {
    name: 'my-reports',
    title: 'Mis Reportes',
    icon: (props: TabIconProps) => (
      <FontAwesome
        {...props}
        name='file-text-o'
        size={24}
      />
    )
  },
  {
    name: 'profile',
    title: 'Mi Perfil',
    icon: (props: TabIconProps) => (
      <Ionicons
        {...props}
        name='person-outline'
        size={24}
      />
    )
  }
] as const

export default function ProtectedLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: `${COLORS.secondary}90`,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: `${COLORS.secondary}20`,
          paddingTop: 20,
          height: 130
        },
        tabBarLabelStyle: {
          fontSize: 16,
          fontWeight: '600'
        },
        tabBarButton: (props: PressableProps) => (
          <Pressable
            {...props}
            style={{
              justifyContent: 'center',
              alignItems: 'center'
            }}
            android_ripple={{
              color: `${COLORS.primary}20`,
              borderless: true,
              radius: 50
            }}
          />
        )
      }}
    >
      {TABS_CONFIG.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: tab.icon
          }}
        />
      ))}
    </Tabs>
  )
}
