import { Input } from '@components/Input'
import { RadioButton } from '@components/RadioInput'
import {
  DARK_COLORS,
  LIGHT_COLORS
} from '@constants/colors'
import { useTheme } from '@context/ThemeContext'
import { useForm } from '@hooks/useForm'
import { AuthService } from '@services/authService'
import { Href, Link, router } from 'expo-router'
import { Check } from 'lucide-react-native'
import { useMemo, useState } from 'react'
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import type { CreateUser } from '../../src/types/createUser'
import type { DocumentType } from '../../src/types/documentType'

const authService = new AuthService()

export default function Register() {
  const {
    form,
    setField,
    resetForm,
    setFields,
    errors,
    setError,
    clearError
  } = useForm<CreateUser>({
    firstname: '',
    lastname: '',
    username: '',
    password: '',
    email: '',
    documentType: 'ID_CARD',
    documentNumber: ''
  })
  const [loading, setLoading] = useState(false)
  const { isDarkMode } = useTheme()
  const colors = isDarkMode ? DARK_COLORS : LIGHT_COLORS

  const documentTypeChange = (type: DocumentType) => {
    setFields({
      documentType: type,
      documentNumber: ''
    })
  }

  const onSubmit = async () => {
    setLoading(true)
    try {
      await authService.register(form)
      resetForm()
      router.replace('/access/login')
      Alert.alert(
        'Registro Exitoso',
        'Bienvenido! Su cuenta ha sido creada.'
      )
    } catch (error) {
      if (error instanceof Error)
        Alert.alert('Error al registrarse', error.message)
    } finally {
      setLoading(false)
    }
  }

  const isValidForm = (): boolean => {
    if (Object.values(form).some((value) => value === ''))
      return false
    if (
      Object.values(errors).some((value) => Boolean(value))
    )
      return false

    return true
  }

  const valid = isValidForm()

  let formattedDocumentNumber = ''

  const digitsOnly = form.documentNumber.replace(/\D/g, '')
  if (form.documentType === 'ID_CARD') {
    const part1 = digitsOnly.slice(0, 3)
    const part2 = digitsOnly.slice(3, 10)
    const part3 = digitsOnly.slice(10, 11)

    formattedDocumentNumber = part1
    if (part2) formattedDocumentNumber += `-${part2}`
    if (part3) formattedDocumentNumber += `-${part3}`
  } else {
    formattedDocumentNumber = `RD${digitsOnly.slice(
      0,
      7
    )}`.toUpperCase()
  }

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
      <ScrollView>
        <View style={styles.screen}>
          <View style={styles.header}>
            <Text
              style={[styles.title, { color: colors.text }]}
            >
              Registrate
            </Text>
            <Text
              style={[
                styles.subtle,
                { color: colors.textSecondary }
              ]}
            >
              Crea una cuenta para continuar.
            </Text>
          </View>
          <View style={styles.inputsContainer}>
            <View style={styles.inputGroup}>
              <View style={styles.inputGroupItem}>
                <Input
                  value={form.firstname}
                  error={errors.firstname}
                  onChangeText={(text) =>
                    setField('firstname', text)
                  }
                  label='Nombre'
                  placeholder='Ingrese su nombre'
                  onEndEditing={() => {
                    if (!form.firstname)
                      return setError(
                        'firstname',
                        'El nombre es obligatorio'
                      )

                    clearError('firstname')
                  }}
                />
              </View>
              <View style={styles.inputGroupItem}>
                <Input
                  value={form.lastname}
                  error={errors.lastname}
                  onChangeText={(text) =>
                    setField('lastname', text)
                  }
                  label='Apellido'
                  placeholder='Ingrese su apellido'
                  onEndEditing={() => {
                    if (!form.lastname)
                      return setError(
                        'lastname',
                        'El apellido es obligatorio'
                      )
                    clearError('lastname')
                  }}
                />
              </View>
            </View>
            <Input
              value={form.username}
              error={errors.username}
              onChangeText={(text) =>
                setField('username', text)
              }
              label='Nombre de Usuario'
              placeholder='Ingrese su nombre de usuario'
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
              value={form.email}
              error={errors.email}
              onChangeText={(text) =>
                setField('email', text)
              }
              label='Correo Electrónico'
              placeholder='Ingrese su correo electrónico'
              keyboardType='email-address'
              autoCapitalize='none'
              onEndEditing={() => {
                if (!form.email)
                  return setError(
                    'email',
                    'El correo electrónico es obligatorio'
                  )
                const emailRegex =
                  /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                if (!emailRegex.test(form.email))
                  return setError(
                    'email',
                    'El correo electrónico no es válido'
                  )
                clearError('email')
              }}
            />
            <View>
              <Input
                value={form.password}
                error={errors.password}
                onChangeText={(text) =>
                  setField('password', text)
                }
                label='Contraseña'
                placeholder='Ingrese su contraseña'
                secureTextEntry={true}
                onEndEditing={() => {
                  if (form.password.length < 8)
                    return setError(
                      'password',
                      'La contraseña debe tener al menos 8 caracteres'
                    )
                  if (!/[A-Z]/.test(form.password))
                    return setError(
                      'password',
                      'La contraseña debe tener al menos una letra mayúscula'
                    )
                  if (!/[a-z]/.test(form.password))
                    return setError(
                      'password',
                      'La contraseña debe tener al menos una letra minúscula'
                    )
                  if (!/[0-9]/.test(form.password))
                    return setError(
                      'password',
                      'La contraseña debe tener al menos un número'
                    )
                  if (!/[^A-Za-z0-9]/.test(form.password))
                    return setError(
                      'password',
                      'La contraseña debe tener al menos un caracter especial'
                    )
                  clearError('password')
                }}
              />
              <PasswordRequirements
                password={form.password}
              />
            </View>
            <DocumentTypeInput
              selected={form.documentType}
              onChange={documentTypeChange}
            />
            <Input
              value={formattedDocumentNumber}
              error={errors.documentNumber}
              onChangeText={(text) =>
                setField('documentNumber', text)
              }
              label='Número de Documento'
              placeholder='Ingrese su número de cédula'
              keyboardType='number-pad'
              maxLength={
                form.documentType === 'ID_CARD' ? 13 : 9
              }
              onEndEditing={() => {
                const digitsOnly =
                  form.documentNumber.replace(/\D/g, '')
                if (!digitsOnly)
                  return setError(
                    'documentNumber',
                    'El número de documento es obligatorio'
                  )
                if (
                  form.documentType === 'ID_CARD' &&
                  digitsOnly.length !== 11
                )
                  return setError(
                    'documentNumber',
                    'El número de cédula debe tener 11 dígitos'
                  )
                if (
                  form.documentType === 'PASSPORT' &&
                  digitsOnly.length !== 7
                )
                  return setError(
                    'documentNumber',
                    'El número de pasaporte debe tener 7 dígitos'
                  )

                clearError('documentNumber')
              }}
            />
          </View>
          <View>
            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: colors.primary },
                (loading || !valid) && styles.buttonDisabled
              ]}
              onPress={onSubmit}
              disabled={!valid}
            >
              <Text style={[styles.buttonText]}>
                {loading ? 'Loading...' : 'Registrarse'}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>
              Ya tienes una cuenta?{' '}
            </Text>
            <Link
              href={'/access/login' as Href}
              replace
            >
              <Text
                style={[
                  styles.loginLink,
                  { color: colors.primary }
                ]}
              >
                Inicia sesion.
              </Text>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
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
    fontSize: 14
  },
  inputsContainer: {
    gap: 8
  },
  inputGroup: {
    flexDirection: 'row',
    gap: 12
  },
  inputGroupItem: {
    flex: 1
  },
  button: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonDisabled: {
    opacity: 0.5
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600'
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 60
  },
  loginText: {
    fontSize: 14,
    color: '#666'
  },
  loginLink: {
    fontSize: 14,
    fontWeight: '600'
  }
})

interface PasswordRequirementsProps {
  password: string
}

const PasswordRequirements = ({
  password
}: PasswordRequirementsProps) => {
  const requirements = useMemo(() => {
    return {
      minLength: password.length >= 8,
      hasNumberAndSymbol:
        /[0-9]/.test(password) &&
        /[^A-Za-z0-9]/.test(password),
      hasUpperAndLower:
        /[A-Z]/.test(password) && /[a-z]/.test(password),
      isStrong:
        password.length >= 8 &&
        /[0-9]/.test(password) &&
        /[^A-Za-z0-9]/.test(password) &&
        /[A-Z]/.test(password) &&
        /[a-z]/.test(password)
    }
  }, [password])

  return (
    <View style={stylesPassword.container}>
      <RequirementItem
        text='Debe tener al menos 8 caracteres.'
        met={requirements.minLength}
      />
      <RequirementItem
        text='Debe contener un número y un símbolo (e.g. !@#).'
        met={requirements.hasNumberAndSymbol}
      />
      <RequirementItem
        text='Debe contener una letra mayúscula y una letra minúscula.'
        met={requirements.hasUpperAndLower}
      />
      <RequirementItem
        text='Introduce una contraseña fuerte usando cuatro palabras comunes al azar o una combinación de caracteres, mayúsculas y números o símbolos. la contraseña no se guardará hasta que veas un cuadro verde.'
        met={requirements.isStrong}
        isLongText
      />
    </View>
  )
}

interface RequirementItemProps {
  text: string
  met: boolean
  isLongText?: boolean
}

const RequirementItem = ({
  text,
  met,
  isLongText
}: RequirementItemProps) => {
  const { isDarkMode } = useTheme()
  const colors = isDarkMode ? DARK_COLORS : LIGHT_COLORS

  return (
    <View style={stylesPassword.requirementRow}>
      <View
        style={[
          stylesPassword.checkbox,
          {
            borderColor: colors.secondary,
            backgroundColor: colors.background
          },
          met && stylesPassword.checkboxMet
        ]}
      >
        {met && (
          <Check
            size={14}
            color={colors.text}
            strokeWidth={3}
          />
        )}
      </View>
      <Text
        style={[
          stylesPassword.requirementText,
          {
            color: colors.text
          },
          met && stylesPassword.requirementTextMet,
          isLongText && stylesPassword.requirementTextLong
        ]}
      >
        {text}
      </Text>
    </View>
  )
}

const stylesPassword = StyleSheet.create({
  container: {
    marginTop: 8,
    gap: 8
  },
  requirementRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2
  },
  checkboxMet: {
    backgroundColor: '#10B981',
    borderColor: '#10B981'
  },
  requirementText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20
  },
  requirementTextMet: {
    color: '#10B981'
  },
  requirementTextLong: {
    fontSize: 13
  }
})

interface DocumentTypeInputProps {
  selected: DocumentType
  onChange: (type: DocumentType) => void
}

const DocumentTypeInput = ({
  selected,
  onChange
}: DocumentTypeInputProps) => {
  const { isDarkMode } = useTheme()
  const colors = isDarkMode ? DARK_COLORS : LIGHT_COLORS

  const selectedType = selected === 'ID_CARD'

  const handleSelect = (type: DocumentType) => {
    onChange(type)
  }

  return (
    <View style={stylesRadio.container}>
      <Text style={stylesRadio.label}>
        Tipo de Documento
      </Text>
      <View style={stylesRadio.inputs}>
        <Pressable
          style={stylesRadio.input}
          onPress={handleSelect.bind(null, 'ID_CARD')}
          disabled={selectedType}
        >
          <RadioButton selected={selectedType} />
          <Text style={{ color: colors.text }}>
            Cédula de Identidad
          </Text>
        </Pressable>
        <Pressable
          style={stylesRadio.input}
          onPress={handleSelect.bind(null, 'PASSPORT')}
          disabled={!selectedType}
        >
          <RadioButton selected={!selectedType} />
          <Text style={{ color: colors.text }}>
            Pasaporte
          </Text>
        </Pressable>
      </View>
    </View>
  )
}

const stylesRadio = StyleSheet.create({
  container: {
    gap: 6,
    marginBottom: 10
  },
  label: {
    fontSize: 12,
    color: '#666'
  },
  inputs: {
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center'
  },
  input: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6
  }
})
