import { GoBackButton } from '@components/GoBackButton'
import { Input } from '@components/Input'
import {
  DARK_COLORS,
  LIGHT_COLORS
} from '@constants/colors'
import { useTheme } from '@context/ThemeContext'
import { useForm } from '@hooks/useForm'
import { AuthService } from '@services/authService'
import { AxiosError } from 'axios'
import { useState } from 'react'
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'

const authService = new AuthService()

export default function LoginScreen() {
  const { form, setField, errors, setError, clearError } =
    useForm({
      username: ''
    })

  const { isDarkMode } = useTheme()
  const colors = isDarkMode ? DARK_COLORS : LIGHT_COLORS
  const [isLoading, setIsLoading] = useState(false)

  const handleForgotPasswd = async () => {
    setIsLoading(true)

    const response = await authService.sendRecoverPasswd(
      form.username
    )

    if (response.status === 200) {
      Alert.alert(
        'Enlace enviado',
        '¡Te hemos enviado un correo de recuperación! Si no lo encuentras, revisa tu bandeja de spam, a veces se enconden ahí ;) '
      )
      form.username = ''
    }

    if (response instanceof AxiosError) {
      if (response.status === 404) {
        Alert.alert(
          'Usuario no encontrado',
          `Verifique el nombre de usuario y vuelva a intentar`
        )
        setError('username', 'Usuario no encontrado')
      } else {
        Alert.alert(
          response.message || 'Error al enviar correo'
        )
      }
    }
    setIsLoading(false)
  }

  const isValidForm = (): boolean => {
    if (form.username === '' || errors.username)
      return false

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
      <View style={styles.screen}>
        <View style={styles.header}>
          <GoBackButton />
          <Text style={[styles.title, { color: colors.text }]}>
            Olvidé mi contraseña
          </Text>
        </View>
        <View style={styles.info}>
          <Image
            style={styles.image}
            source={require('./../../assets/images/recover.png')}
          />
          <Text style={[styles.infoText, { color: colors.text }]}>
            Por favor, introduce tu nombre de usuario para
            recibir al correo electrónico un enlace de
            verificación
          </Text>
        </View>
        <View>
          <Input
            value={form.username}
            error={errors.username}
            onChangeText={(text) =>
              setField('username', text)
            }
            label={'Nombre de Usuario'}
            placeholder={'Furgencio'}
            autoCapitalize='none'
            onEndEditing={() => {
              if (!form.username)
                return setError(
                  'username',
                  'El nombre de Usuario es obligatorio'
                )
              if (form.username.includes(' '))
                return setError(
                  'username',
                  'El nombre de Usuario no debe contener espacios'
                )
              clearError('username')
            }}
          />
        </View>
        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: colors.primary },
            (isLoading || !valid) && styles.buttonDisabled
          ]}
          onPress={handleForgotPasswd}
          disabled={!valid || isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Cargando...' : 'Enviar'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  screen: {
    paddingHorizontal: 24,
    paddingTop: 60,
    gap: 60
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
    fontWeight: 600
  },
  image: {
    width: 200,
    height: 200,

    borderRadius: 100,
    margin: 15
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
