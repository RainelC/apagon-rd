import {
  DARK_COLORS,
  LIGHT_COLORS
} from '@constants/colors'
import { useTheme } from '@context/ThemeContext'
import { StyleSheet, View } from 'react-native'

interface RadioButtonProps {
  style?: object
  selected: boolean
}

export function RadioButton({
  style,
  selected
}: RadioButtonProps) {
  const { isDarkMode } = useTheme()
  const colors = isDarkMode ? DARK_COLORS : LIGHT_COLORS

  return (
    <View
      style={[
        styles.radioCircle,
        style,
        {
          backgroundColor: selected
            ? colors.primary
            : colors.background,
          borderColor: selected
            ? colors.primary
            : `${colors.secondary}60`
        }
      ]}
    >
      {selected ? (
        <View
          style={[
            styles.selectedRb,
            {
              backgroundColor: selected
                ? colors.text
                : colors.textSecondary
            }
          ]}
        />
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  radioCircle: {
    height: 18,
    width: 18,
    borderRadius: 9,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  selectedRb: {
    height: 7,
    width: 7,
    borderRadius: 4
  }
})
