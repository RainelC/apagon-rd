import { AuthContext } from '@context/AuthContext'
import { useContext } from 'react'
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet
} from 'react-native'

export default function Profile() {
  const auth = useContext(AuthContext)
  if (!auth)
    return (
      <ActivityIndicator
        size='large'
        color='#0000ff'
      />
    )

  const { signOut } = auth

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button}>
        <Text
          onPress={signOut}
          style={styles.buttonText}
        >
          Sign Out
        </Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  button: {
    backgroundColor: '#ff4444',
    padding: 15,
    margin: 20,
    borderRadius: 12
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center'
  }
})
