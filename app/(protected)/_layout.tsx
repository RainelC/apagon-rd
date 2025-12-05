import { COLORS } from '@constants/colors'
import {
  AntDesign,
  FontAwesome,
  Ionicons,
  Octicons
} from '@expo/vector-icons'
import { Tabs } from 'expo-router'
import {
  Pressable,
  PressableProps,
  StyleSheet,
  Text
} from 'react-native'

type TabIconProps = {
  color: string
  size: number
}

const TABS_CONFIG = [
  {
    name: 'index',
    headerTitle: 'Inicio',
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
    headerTitle: 'Reportar Avería',
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
    headerTitle: 'Mis Reportes',
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
    headerTitle: 'Mi Perfil',
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
            headerTitle: () => (
              <Text style={styles.headerTitle}>
                {tab.headerTitle}
              </Text>
            ),
            title: tab.title,
            tabBarIcon: tab.icon
          }}
        />
      ))}
      <Tabs.Screen
        name='reportDetails'
        options={{
          href: null,
          headerShown: false
        }}
      />
      <Tabs.Screen
        name='chatbot'
        options={{
          href: null,
          headerShown: false
        }}
      />
      <Tabs.Screen
        name='sectorStats'
        options={{
          href: null,
          headerShown: false
        }}
      />
    </Tabs>
  )
}

const styles = StyleSheet.create({
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000'
  }
})
