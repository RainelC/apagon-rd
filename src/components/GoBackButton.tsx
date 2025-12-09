import {
  DARK_COLORS,
  LIGHT_COLORS
} from '@constants/colors'
import { useTheme } from '@context/ThemeContext'
import { MaterialIcons } from '@react-native-vector-icons/material-icons'
import { router } from 'expo-router'
import { Pressable } from 'react-native'

export const GoBackButton = () => {
  const { isDarkMode } = useTheme()
  const colors = isDarkMode ? DARK_COLORS : LIGHT_COLORS
  return (
    <Pressable onPress={() => router.back()}>
      <MaterialIcons
        name='keyboard-arrow-left'
        size={35}
        style={{ color: colors.text }}
      />
    </Pressable>
  )
}
