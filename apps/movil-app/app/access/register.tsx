import { Input } from '@components/Input'
import { useForm } from '@hooks/useForm'
import { Link, router } from 'expo-router'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Pressable,
  ScrollView
} from 'react-native'

import { AuthService } from '@services/authService'
import { DocumentType } from '../../src/types/documentType'
import { RadioButton } from '@components/RadioInput'
import { CreateUser } from '../../src/types/createUser'
import { COLORS } from '@constants/colors'
import { AxiosError } from 'axios'
import { useState } from 'react'

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

  const documentTypeChange = (type: DocumentType) => {
    setFields({
      documentType: type,
      documentNumber: ''
    })
  }

  const onSubmit = async () => {
    setLoading(true)
    try {
      const created = await authService.register(form)
      if (!created)
        throw new Error('No se pudo crear el usuario')
      Alert.alert(
        'Registro Exitoso',
        'Bienvenido! Su cuenta ha sido creada.'
      )
      resetForm()
      router.replace('/access/login')
    } catch (error) {
      if (error instanceof AxiosError) {
        Alert.alert(
          'Error al registrarse',
          error.response?.data.message
        )
      }
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
      style={styles.container}
    >
      <ScrollView>
        <View style={styles.screen}>
          <View style={styles.header}>
            <Text style={styles.title}>Registrate</Text>
            <Text style={styles.subtle}>
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
                  props={{
                    onEndEditing: () => {
                      if (!form.firstname)
                        return setError(
                          'firstname',
                          'El nombre es obligatorio'
                        )

                      clearError('firstname')
                    }
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
                  props={{
                    onEndEditing: () => {
                      if (!form.lastname)
                        return setError(
                          'lastname',
                          'El apellido es obligatorio'
                        )
                      clearError('lastname')
                    }
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
              props={{
                autoCapitalize: 'none',
                onEndEditing: () => {
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
                }
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
              props={{
                keyboardType: 'email-address',
                autoCapitalize: 'none',
                onEndEditing: () => {
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
                }
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
              props={{
                secureTextEntry: true,
                onEndEditing: () => {
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
                }
              }}
            />
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
              props={{
                keyboardType: 'number-pad',
                maxLength:
                  form.documentType === 'ID_CARD' ? 13 : 9,
                onEndEditing: () => {
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
                }
              }}
            />
          </View>
          <View>
            <TouchableOpacity
              style={[
                styles.button,
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
              href='/access/login'
              replace
            >
              <Text style={styles.loginLink}>
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
  inputGroup: {
    flexDirection: 'row',
    gap: 12
  },
  inputGroupItem: {
    flex: 1
  },
  button: {
    backgroundColor: COLORS.primary,
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
    justifyContent: 'center'
  },
  loginText: {
    fontSize: 14,
    color: '#666'
  },
  loginLink: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600'
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
          <Text>Cédula de Identidad</Text>
        </Pressable>
        <Pressable
          style={stylesRadio.input}
          onPress={handleSelect.bind(null, 'PASSPORT')}
          disabled={!selectedType}
        >
          <RadioButton selected={!selectedType} />
          <Text>Pasaporte</Text>
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
