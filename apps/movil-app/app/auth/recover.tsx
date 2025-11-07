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

const authService = new AuthService()

function RecoverScreen() {
  const token = ''
  const { form, setField, errors, setError, clearError } =
    useForm({
      password: '',
      repeated: '',
      token: token || ''
    })

  const [isLoading, setIsLoading] = useState(false)

  const handleForgotPasswd = async () => {
    setIsLoading(true)

    const response = await authService.recoverPasswd(form)

    if (response === 200) {
      Alert.alert(
        '¡Contraseña cambiada correctamente!',
        'Ya puedes iniciar sesión con tu nueva contraseña.'
      )
    }

    if (response === 403) {
      Alert.alert(
        'Enlace de recuperación invalido',
        'El enlace para restablecer la contraseña no es válido o ha caducado, posiblemente porque ya se había utilizado.'
      )
    }
    setIsLoading(false)
  }

  const isValidForm = (): boolean => {
    if (!/[A-Z]/.test(form.password)) {
      setError(
        'password',
        'La contraseña debe contener al menos una mayúscula'
      )
      return false
    }
    if (!/[a-z]/.test(form.password)) {
      setError(
        'password',
        'La contraseña debe contener al menos una minúscula'
      )
      return false
    }
    if (!/[0-9]/.test(form.password)) {
      setError(
        'password',
        'La contraseña debe contener al menos un numero'
      )
      return false
    }
    if (!/\W/.test(form.password)) {
      setError(
        'password',
        'La contraseña debe contener al menos un carácter especial'
      )
      return false
    }

    if (form.password.length < 8) {
      setError(
        'password',
        'La contraseña debe contener al menos 8 caracteres'
      )
      return false
    }

    if (form.password === '' || errors.password)
      return false

    if (form.repeated === '' || errors.repeated)
      return false

    if (form.password !== form.repeated) {
      setError(
        'repeated',
        'Las contraseñas deben coincidir'
      )
      return false
    }

    setError('password', '')
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
                if (!form.password)
                  return setError(
                    'password',
                    'La contraseña es obligatoria'
                  )
                if (form.password.includes(' '))
                  return setError(
                    'password',
                    'El nombre de Usuario no debe contener espacios'
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
                if (!form.password)
                  return setError(
                    'repeated',
                    'La contraseña es obligatoria'
                  )
                if (form.repeated.includes(' '))
                  return setError(
                    'repeated',
                    'El nombre de Usuario no debe contener espacios'
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
