import { Input } from '@components/Input'
import { COLORS } from '@constants/colors'
import { useForm } from '@hooks/useForm'
import { AuthService } from '@services/authService'
import { AxiosError } from 'axios'
import { Href, Link, router } from 'expo-router'
import { useContext, useState } from 'react'
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { AuthContext } from '../../src/context/AuthContext'

const authService = new AuthService()

export default function LoginScreen() {
  const { form, setField, errors, setError, clearError } =
    useForm({
      username: '',
      password: ''
    })

  const { signIn } = useContext(AuthContext)!
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async () => {
    try {
      setIsLoading(true)
      const response = await authService.login(
        form.username,
        form.password
      )
      await signIn(response.token)

      router.replace('/(protected)' as Href)
    } catch (error) {
      let errorMessage = 'Error al iniciar sesión'
      
      if (error instanceof AxiosError) {
        if (error.code === 'ECONNABORTED') {
          errorMessage = 'La solicitud tardó demasiado. Verifica tu conexión.'
        } else if (error.response) {
          errorMessage = error.response.data?.message || `Error del servidor (${error.response.status})`
        } else if (error.request) {
          errorMessage = 'No se pudo conectar al servidor. Verifica tu conexión.'
        } else {
          errorMessage = error.message || 'Error al iniciar sesión'
        }
      } else if (error instanceof Error) {
        errorMessage = error.message
      }
      Alert.alert('Error', errorMessage)
    } finally {
      setIsLoading(false)
      setField('password', '')
    }
  }

  const isValidForm = (): boolean => {
    if (Object.values(form).some((value) => value === ''))
      return false

    return true
  }

  const valid = isValidForm()

  return (
    <KeyboardAvoidingView
      behavior={
        Platform.OS === 'ios' ? 'padding' : 'height'
      }
      style={styles.container}
    >
      <View style={styles.screen}>
        <View style={styles.header}>
          <Text style={styles.title}>Inicia sesion</Text>
          <Text style={styles.subtle}>
            Accede a tu cuenta para continuar
          </Text>
        </View>
        <View style={styles.inputsContainer}>
          <Input
            value={form.username}
            error={errors.username}
            onChangeText={(text) =>
              setField('username', text)
            }
            label='Nombre de Usuario'
            placeholder='example@gmail.com'
            keyboardType='email-address'
            autoCapitalize='none'
            onEndEditing={() => {
              if (!form.username)
                return setError(
                  'username',
                  'El nombre de usuario es obligatorio'
                )
              if (form.username.includes(' '))
                return setError(
                  'username',
                  'El nombre de usuario no debe contener espacios'
                )
              clearError('username')
            }}
          />
          <Input
            value={form.password}
            error={errors.password}
            onChangeText={(text) =>
              setField('password', text)
            }
            label='Contraseña'
            placeholder='Ingrese su contraseña'
            secureTextEntry={true}
            autoCapitalize='none'
            onEndEditing={() => {
              if (!form.password)
                return setError(
                  'password',
                  'La contraseña es obligatoria'
                )
              clearError('password')
            }}
          />
          <Link
            href={'/access/forgot-passwd' as Href}
            style={styles.forgetPasswd}
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </View>

        <TouchableOpacity
          style={[
            styles.loginButton,
            (isLoading || !valid) &&
              styles.loginButtonDisabled
          ]}
          onPress={handleLogin}
          disabled={!valid || isLoading}
        >
          <Text style={styles.loginButtonText}>
            {isLoading ? 'Loading...' : 'Login'}
          </Text>
        </TouchableOpacity>

        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>
            No tienes una cuenta?{' '}
          </Text>
          <Link
            href={'/access/register' as Href}
            replace
          >
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
    backgroundColor: COLORS.background
  },
  screen: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    gap: 18
  },
  header: {
    gap: 4
  },
  title: {
    fontSize: 28,
    fontWeight: '600'
  },
  subtle: {
    fontSize: 14,
    color: '#666'
  },
  inputsContainer: {
    gap: 8
  },
  loginButton: {
    backgroundColor: COLORS.primary,
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8
  },
  loginButtonDisabled: {
    opacity: 0.5
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600'
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  signupText: {
    fontSize: 14,
    color: '#666'
  },
  signupLink: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600'
  },
  forgetPasswd: {
    fontSize: 14,
    color: COLORS.primary,
    textAlign: 'right'
  }
})
