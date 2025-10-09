// username, password, email, firstname, lastname, documentType, documentNumber
type DocumentType = 'ID_CARD' | 'PASSPORT'
import { Input } from '@components/Input'
import { Link } from 'expo-router'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native'

export default function Register() {
  return (
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
              label='Nombre'
              placeholder='Ingrese su nombre'
            />
          </View>
          <View style={styles.inputGroupItem}>
            <Input
              label='Apellido'
              placeholder='Ingrese su apellido'
            />
          </View>
        </View>
        <Input
          label='Nombre de Usuario'
          placeholder='Ingrese su nombre de usuario'
        />
        <Input
          label='Contraseña'
          placeholder='Ingrese su contraseña'
          props={{ secureTextEntry: true }}
        />
        <Input
          label='Correo Electrónico'
          placeholder='Ingrese su correo electrónico'
        />
        <Input
          label='Tipo de Documento'
          placeholder='Seleccione el tipo de documento'
        />
        <Input
          label='Número de Documento'
          placeholder='Ingrese el número de documento'
        />
      </View>
      <View>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Registrarse</Text>
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
  )
}

const styles = StyleSheet.create({
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
