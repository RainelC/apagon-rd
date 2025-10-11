import { COLORS } from '@constants/colors'
import { StyleSheet, View } from 'react-native'

interface RadioButtonProps {
  style?: object
  selected: boolean
}

export function RadioButton({
  style,
  selected
}: RadioButtonProps) {
  return (
    <View
      style={[
        styles.radioCircle,
        style,
        {
          backgroundColor: selected
            ? COLORS.primary
            : COLORS.background,
          borderColor: selected
            ? COLORS.primary
            : `${COLORS.secondary}60`
        }
      ]}
    >
      {selected ? (
        <View
          style={[
            styles.selectedRb,
            {
              backgroundColor: selected
                ? '#ffffffff'
                : '#a1a1a1ff'
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
