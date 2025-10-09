import { Input } from '@components/Input'
import { useForm } from '@hooks/useForm'
import { Link } from 'expo-router'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform
} from 'react-native'

type DocumentType = 'ID_CARD' | 'PASSPORT'

export default function Register() {
  const { form, handleChange, resetForm } = useForm({
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    email: '',
    documentType: '' as DocumentType,
    documentNumber: ''
  })
  const onSubmit = async () => {
    console.log(form)
    resetForm()
  }
  return (
    <KeyboardAvoidingView
      behavior={
        Platform.OS === 'ios' ? 'padding' : 'height'
      }
      style={styles.container}
    >
      <View style={styles.screen}>
        <View style={styles.header}>
          <Text style={styles.title}>Registrase</Text>
          <Text style={styles.subtle}>
            Crea una cuenta para continuar.
          </Text>
        </View>
        <View style={styles.inputsContainer}>
          <View style={styles.inputGroup}>
            <View style={styles.inputGroupItem}>
              <Input
                value={form.firstName}
                onChangeText={(text) =>
                  handleChange('firstName', text)
                }
                label='Nombre'
                placeholder='Ingrese su nombre'
              />
            </View>
            <View style={styles.inputGroupItem}>
              <Input
                value={form.lastName}
                onChangeText={(text) =>
                  handleChange('lastName', text)
                }
                label='Apellido'
                placeholder='Ingrese su apellido'
              />
            </View>
          </View>
          <Input
            value={form.username}
            onChangeText={(text) =>
              handleChange('username', text)
            }
            label='Nombre de Usuario'
            placeholder='Ingrese su nombre de usuario'
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
          <Input
            value={form.email}
            onChangeText={(text) =>
              handleChange('email', text)
            }
            label='Correo Electrónico'
            placeholder='Ingrese su correo electrónico'
          />
          <Input
            value={form.documentType}
            onChangeText={(text) =>
              handleChange('documentType', text)
            }
            label='Tipo de Documento'
            placeholder='Seleccione el tipo de documento'
          />
          <Input
            value={form.documentNumber}
            onChangeText={(text) =>
              handleChange('documentNumber', text)
            }
            label='Número de Documento'
            placeholder='Ingrese el número de documento'
          />
        </View>
        <View>
          <TouchableOpacity
            style={styles.button}
            onPress={onSubmit}
          >
            <Text style={styles.buttonText}>
              Registrarse
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>
            Ya tienes una cuenta?{' '}
          </Text>
          <Link href='/access/login'>
            <Text style={styles.loginLink}>
              Inicia sesion.
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
  screen: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    gap: 24
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
    gap: 20
  },
  inputGroup: {
    flexDirection: 'row',
    gap: 12
  },
  inputGroupItem: {
    flex: 1
  },
  button: {
    backgroundColor: '#1A1A1A',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center'
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
    color: '#1A1A1A',
    fontWeight: '600'
  }
})
