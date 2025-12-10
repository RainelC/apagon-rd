import { GoBackButton } from '@components/GoBackButton'
import { Input } from '@components/Input'
import {
  DARK_COLORS,
  LIGHT_COLORS
} from '@constants/colors'
import { useTheme } from '@context/ThemeContext'
import { useForm } from '@hooks/useForm'
import { AuthService } from '@services/authService'
import { router } from 'expo-router'
import { useState } from 'react'
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'

const authService = new AuthService()

const RecoverScreen = () => {
  const {
    form,
    setField,
    errors,
    setError,
    clearError,
    resetForm
  } = useForm({
    currentPassword: '',
    password: '',
    repeated: '',
  })

  const { isDarkMode } = useTheme()
  const colors = isDarkMode ? DARK_COLORS : LIGHT_COLORS

  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async () => {
    setIsLoading(true)

    try {
      await authService.changePassword({
          currentPassword: form.currentPassword,
          newPassword: form.password,
          confirmPassword: form.repeated
        })
        Alert.alert(
          '¡Contraseña actualizada!',
          'Tu contraseña ha sido cambiada correctamente.'
        )
        resetForm()
        router.back()
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Ocurrió un error inesperado'
      Alert.alert('Error', message)
    } finally {
      setIsLoading(false)
    }
  }

  const isValidForm = (): boolean => {
    if (form.password === '' || errors.password)
      return false

    if (form.password.length < 8 && !errors.password) {
      setError(
        'password',
        'La contraseña debe contener al menos 8 caracteres'
      )
      return false
    }
    if (!/[a-z]/.test(form.password) && !errors.password) {
      setError(
        'password',
        'La contraseña debe contener al menos una minúscula'
      )
      return false
    }

    if (!/[A-Z]/.test(form.password) && !errors.password) {
      setError(
        'password',
        'La contraseña debe contener al menos una mayúscula'
      )
      return false
    }

    if (!/[0-9]/.test(form.password) && !errors.password) {
      setError(
        'password',
        'La contraseña debe contener al menos un numero'
      )
      return false
    }
    if (!/\W/.test(form.password) && !errors.password) {
      setError(
        'password',
        'La contraseña debe contener al menos un carácter especial'
      )
      return false
    }

    if (form.repeated === '' || errors.repeated)
      return false

    if (form.password !== form.repeated) return false

    return true
  }

  const valid = isValidForm()
  return (
    <KeyboardAvoidingView
      behavior={
        Platform.OS === 'ios' ? 'padding' : 'height'
      }
      style={[
        styles.container,
        { backgroundColor: colors.background }
      ]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.screen}>
          <View style={styles.header}>
            <GoBackButton />
            <Text
              style={[styles.title, { color: colors.text }]}
            >
              Cambiar contraseña
            </Text>
          </View>
          <View style={styles.info}>
            <Image
              style={styles.image}
              source={require('./../../assets/images/recover.png')}
            />
            <Text
              style={[
                styles.infoText,
                { color: colors.textSecondary }
              ]}
            >
              Actualiza tu contraseña para mantener tu cuenta segura.
            </Text>
          </View>
          <View style={styles.formContainer}>
            <Input
                value={form.currentPassword}
                onChangeText={(text) =>
                  setField('currentPassword', text)
                }
                label={'Contraseña actual'}
                placeholder={'*********'}
                secureTextEntry={true}
                autoCapitalize={'none'}
              />
            <Input
              value={form.password}
              error={errors.password}
              onChangeText={(text) =>
                setField('password', text)
              }
              label={'Contraseña'}
              placeholder={'*********'}
              secureTextEntry={true}
              autoCapitalize={'none'}
              onChange={() => {
                if (form.password.includes(' '))
                  return setError(
                    'password',
                    'La contraseña no debe contener espacios'
                  )
                clearError('password')
              }}
              onEndEditing={() => {
                if (!form.password)
                  return setError(
                    'password',
                    'La contraseña es obligatoria'
                  )

                clearError('password')
              }}
            />
            <Input
              value={form.repeated}
              error={errors.repeated}
              onChangeText={(text) =>
                setField('repeated', text)
              }
              label={'Confirmar contraseña'}
              placeholder={'*********'}
              secureTextEntry={true}
              autoCapitalize='none'
              onEndEditing={() => {
                if (!form.repeated)
                  return setError(
                    'repeated',
                    'Debe repetir la contraseña'
                  )
                clearError('repeated')
              }}
              onChange={() => {
                if (form.password !== form.repeated)
                  return setError(
                    'repeated',
                    'Las contraseñas deben coincidir'
                  )
                clearError('repeated')
              }}
            />
          </View>
          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor: colors.primary
              },
              (isLoading || !valid) && styles.buttonDisabled
            ]}
            onPress={handleSubmit}
            disabled={!valid || isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? 'Cargando...' : 'Guardar'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  scrollContent: {
    flexGrow: 1
  },
  screen: {
    paddingHorizontal: 24,
    paddingTop: 60,
    gap: 40,
    paddingBottom: 40
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    textAlign: 'center'
  },
  info: {
    alignItems: 'center'
  },
  infoText: {
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '600'
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100,
    margin: 15
  },
  formContainer: {
    gap: 16
  },
  button: {
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8
  },
  buttonDisabled: {
    opacity: 0.5
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600'
  }
})

export default RecoverScreen
