import { Input } from '@components/Input'
import { useForm } from '@hooks/useForm'
import { Link } from 'expo-router'
import { useState, useContext } from 'react'
import { router } from 'expo-router'
import { AuthContext } from '../../src/context/AuthContext'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native'
import { AuthService } from '@services/authService'

const authService = new AuthService()

export default function LoginScreen() {
  const { form, handleChange, resetForm } = useForm({
    username: '',
    password: ''
  })

  const { signIn } = useContext(AuthContext)!
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async () => {
    try {
      setIsLoading(true)

      // Llamo a la api
      const response = await authService.login(
        form.username,
        form.password
      )

      // guardo el token y el usuario en el authcontext
      await signIn(response.token)

      router.replace('/(protected)')
    } catch (error: any) {
      Alert.alert(
        error.message || 'Error al iniciar sesion'
      )
    } finally {
      setIsLoading(false)
      resetForm()
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={
        Platform.OS === 'ios' ? 'padding' : 'height'
      }
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Login</Text>

        <View style={styles.inputsContainer}>
          <Input
            value={form.username}
            onChangeText={(text) =>
              handleChange('username', text)
            }
            label='Nombre de Usuario'
            placeholder='example@gmail.com'
          />
          <Input
            value={form.password}
            onChangeText={(text) =>
              handleChange('password', text)
            }
            label='Contraseña'
            placeholder='Ingrese su contraseña'
            props={{ secureTextEntry: true }}
          />
        </View>

        <TouchableOpacity
          style={[
            styles.loginButton,
            isLoading && styles.loginButtonDisabled
          ]}
          onPress={handleLogin}
          disabled={isLoading}
        >
          <Text style={styles.loginButtonText}>
            {isLoading ? 'Loading...' : 'Login'}
          </Text>
        </TouchableOpacity>

        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>
            No tienes una cuenta?{' '}
          </Text>
          <Link href='/access/register'>
            <Text style={styles.signupLink}>
              Registrate.
            </Text>
          </Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5'
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 80,
    gap: 18
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 24
  },
  inputsContainer: {
    gap: 20
  },
  checkMark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#1A1A1A',
    alignItems: 'center',
    justifyContent: 'center'
  },
  checkMarkText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold'
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 1,
    borderColor: '#E5E5E5'
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
    color: '#1A1A1A'
  },
  eyeIcon: {
    padding: 4
  },
  eyeIconText: {
    fontSize: 18
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: 8
  },
  forgotPasswordText: {
    fontSize: 13,
    color: '#666'
  },
  loginButton: {
    backgroundColor: '#1A1A1A',
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8
  },
  loginButtonDisabled: {
    backgroundColor: '#666'
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600'
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24
  },
  signupText: {
    fontSize: 14,
    color: '#666'
  },
  signupLink: {
    fontSize: 14,
    color: '#1A1A1A',
    fontWeight: '600'
  }
})
