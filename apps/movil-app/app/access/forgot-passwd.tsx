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
  Image,
  Touchable,
  Pressable
} from 'react-native'
import { AuthService } from '@services/authService'
import { COLORS } from '@constants/colors'
import { GoBackButton } from '@components/GoBackButton'
import { AxiosError } from 'axios'

const authService = new AuthService()

export default function LoginScreen() {
  const { form, setField, errors, setError, clearError } =
    useForm({
      username: '',
      email: ''
    })

  const [isLoading, setIsLoading] = useState(false)
  const [way, setWay] = useState<'username' | 'email'>(
    'email'
  )

  const handleForgotPasswd = async () => {
    const usernameWay: boolean = way !== 'email'
    setIsLoading(true)
    console.log(usernameWay)

    const response = await authService.sendRecoverPasswd(
      usernameWay ? form.username : form.email
    )

    if (response.status === 200)
      Alert.alert(
        'Enlace enviado',
        '¡Te hemos enviado un correo de recuperación! Si no lo encuentras, revisa tu bandeja de spam, a veces se enconden ahí ;) '
      )

    if (response instanceof AxiosError) {
      if (response.status === 404) {
        Alert.alert(
          'Usuario no encontrado',
          `Verifique el ${
            usernameWay ? 'nombre de usuario' : 'correo'
          } y vuelva a intentar`
        )
        usernameWay
          ? setError('username', 'Usuario no encontrado')
          : setError(
              'email',
              'Correo electrónico no encontrado'
            )
      } else {
        Alert.alert(
          response.message || 'Error al enviar correo'
        )
      }
    }
    setIsLoading(false)
  }

  const isValidForm = (): boolean => {
    if (way === 'username')
      if (form.username === '' || errors.username)
        return false 
    if (way === 'email')
      if (form.email === '' || errors.email) 
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
            Olvidé mi contraseña
          </Text>
        </View>
        <View style={styles.info}>
          <Image
            style={styles.image}
            source={require('./../../assets/images/placeholder-recover.png')}
          />
          <Text style={styles.infoText}>
            {way === 'username'
              ? 'Por favor, introduce tu nombre de usuario para recibir al correo electrónico un enlace de verificación'
              : 'Por favor, introduce tu correo electrónico para recibir un enlace de verificación'}
          </Text>
        </View>
        <View>
          <Input
            value={form.username}
            error={errors.username}
            onChangeText={(text) => setField(way, text)}
            label={
              way !== 'email'
                ? 'Nombre de Usuario'
                : 'Correo electrónico'
            }
            placeholder={
              way !== 'email'
                ? 'Furgencio'
                : 'furgencio@example.com'
            }
            props={{
              autoCapitalize: 'none',
              onEndEditing: () => {
                if (!form.username)
                  return setError(
                    way,
                    `El ${
                      way !== 'email'
                        ? 'nombre de Usuario'
                        : 'correo electrónico'
                    } es obligatorio`
                  )
                if (form.username.includes(' '))
                  return setError(
                    way,
                    `El ${
                      way !== 'email'
                        ? 'nombre de Usuario'
                        : 'correo electrónico'
                    } no debe contener espacios`
                  )
                clearError(way)
              }
            }}
          />
        </View>
        <Pressable
          onPress={() => {
            setError(way, '')
            setField(way, '')
            setWay(way === 'email' ? 'username' : 'email')
          }}
        >
          <Text style={styles.anotherWayText}>
            Usar otro método
          </Text>
        </Pressable>
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
