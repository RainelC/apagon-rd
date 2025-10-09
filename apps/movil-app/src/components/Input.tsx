import {
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native'

interface InputProps {
  value: string
  onChangeText: (text: string) => void
  label: string
  placeholder: string
  props?: any
}

const Input = ({
  label,
  placeholder,
  props = {}
}: InputProps) => {
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor='#999'
        {...props}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  inputContainer: {
    gap: 6
  },
  label: {
    fontSize: 12,
    color: '#666'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 14,
    backgroundColor: '#fff',
    fontSize: 14
  }
})

export { Input }
