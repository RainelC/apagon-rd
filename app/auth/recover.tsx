import { Input } from '@components/Input'
import { useForm } from '@hooks/useForm'
import { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image
} from 'react-native'
import { AuthService } from '@services/authService'
import { COLORS } from '@constants/colors'
import { GoBackButton } from '@components/GoBackButton'
import { Href, Redirect, useLocalSearchParams } from 'expo-router'

const authService = new AuthService()

function RecoverScreen() {
  const { token } = useLocalSearchParams()
  const { form, setField, errors, setError, clearError } =
    useForm({
      password: '',
      repeated: '',
      token: (token as string) || ' '
    })

  const [isLoading, setIsLoading] = useState(false)

  const handleForgotPasswd = async () => {
    setIsLoading(true)
    form.token = token as string
    const response = await authService.recoverPasswd(form)
    if (response.status === 200) {
      Alert.alert(
        '¡Contraseña cambiada correctamente!',
        'Ya puedes iniciar sesión con tu nueva contraseña.'
      )
      return <Redirect href={'access/forgot-passwd' as Href} />
    }

    if (response.status === 403) {
      Alert.alert(
        'Enlace de recuperación invalido',
        'El enlace para restablecer la contraseña no es válido o ha caducado, posiblemente porque ya se había utilizado.'
      )
    }

    if (response.status === 400) {
      Alert.alert(
        'Algo salió mal',
        'Inténtelo de nuevo más tarde'
      )
    }
    setIsLoading(false)
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
          <GoBackButton />
          <Text style={styles.title}>
            Crear nueva contraseña
          </Text>
        </View>
        <View style={styles.info}>
          <Image
            style={styles.image}
            source={require('./../../assets/images/placeholder-recover.png')}
          />
          <Text style={styles.infoText}>
            Tu nueva contraseña debería ser diferente a tu
            contraseña anterior.
          </Text>
        </View>
        <View>
          <Input
            value={form.password}
            error={errors.password}
            onChangeText={(text) =>
              setField('password', text)
            }
            label={'Contraseña'}
            placeholder={'*********'}
            props={{
              secureTextEntry: true,
              autoCapitalize: 'none',
              onChange: () => {
                if (form.password.includes(' '))
                  return setError(
                    'password',
                    'La contraseña no debe contener espacios'
                  )
                clearError('password')
              },
              onEndEditing: () => {
                if (!form.password)
                  return setError(
                    'password',
                    'La contraseña es obligatoria'
                  )

                clearError('password')
              }
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
            props={{
              secureTextEntry: true,
              autoCapitalize: 'none',
              onEndEditing: () => {
                if (!form.repeated)
                  return setError(
                    'repeated',
                    'Debe repetir la contraseña'
                  )
                clearError('repeated')
              },
              onChange: () => {
                if (form.password !== form.repeated)
                  return setError(
                    'repeated',
                    'Las contraseñas deben coincidir'
                  )
                clearError('repeated')
              }
            }}
          />
        </View>
        <TouchableOpacity
          style={[
            styles.button,
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
    flex: 1,
    backgroundColor: COLORS.background
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
  anotherWayText: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 600,
    textDecorationLine: 'underline',
    color: COLORS.primary
  },
  image: {
    width: 200,
    height: 200,
    color: COLORS.primary,
    borderRadius: 100,
    margin: 15
  },
  button: {
    backgroundColor: COLORS.primary,
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
