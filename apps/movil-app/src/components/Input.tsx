import { COLORS } from '@constants/colors'
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View
} from 'react-native'

interface InputProps {
  value: string
  onChangeText: (text: string) => void
  label: string
  placeholder: string
  props?: TextInputProps
  error?: string
}

const Input = ({
  label,
  placeholder,
  props = {},
  value,
  onChangeText,
  error
}: InputProps) => {
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        style={[
          styles.input,
          error ? styles.inputError : null
        ]}
        placeholder={placeholder}
        placeholderTextColor='#999'
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
    fontSize: 12,
    color: COLORS.secondary
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
    marginTop: 2,
  }
})

export { Input }
