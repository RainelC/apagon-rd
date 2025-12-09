import {
  DARK_COLORS,
  LIGHT_COLORS
} from '@constants/colors'
import { useTheme } from '@context/ThemeContext'
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View
} from 'react-native'

interface InputProps extends TextInputProps {
  value: string
  onChangeText: (text: string) => void
  label: string
  placeholder: string
  error?: string
}

const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  ...props
}) => {
  const { isDarkMode } = useTheme()
  const colors = isDarkMode ? DARK_COLORS : LIGHT_COLORS
  return (
    <View style={styles.inputContainer}>
      <Text
        style={[styles.label, { color: colors.secondary }]}
      >
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        style={[
          styles.input,
          {
            backgroundColor: colors.inputBackground,
            color: colors.text,
            borderColor: colors.border
          },
          error ? styles.inputError : null
        ]}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        {...props}
      />
      <Text style={styles.errorText}>{error}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  inputContainer: {
    gap: 2
  },
  label: {
    fontSize: 12
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 14,
    backgroundColor: '#fff',
    fontSize: 14
  },
  inputError: {
    borderColor: '#ff4d4f'
  },
  errorText: {
    color: '#ff4d4f',
    fontSize: 10,
    marginTop: 2
  }
})

export { Input }
