import { Input } from '@components/Input'
import {
  DARK_COLORS,
  LIGHT_COLORS
} from '@constants/colors'
import { useTheme } from '@context/ThemeContext'
import { MaterialIcons } from '@expo/vector-icons'
import { useAuth } from '@hooks/useAuth'
import { userService } from '@services/userService'
import { router, Tabs, useFocusEffect } from 'expo-router'
import { useCallback, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { User } from '../../src/types/User'

export default function Profile() {
  const auth = useAuth()
  const { signOut } = auth

  const [user, setUser] = useState<User>()
  const [loading, setLoading] = useState(true)

  const { isDarkMode, toggleTheme } = useTheme()
  const colors = isDarkMode ? DARK_COLORS : LIGHT_COLORS

  useFocusEffect(
    useCallback(() => {
      loadProfile()
    }, [])
  )

  const handleChange = (key: keyof User, value: string) => {
    setUser((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        [key]: value
      }
    })
  }

  const loadProfile = async () => {
    try {
      const currentUser = await userService.getCurrentUser()
      setUser(currentUser)
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar el perfil')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setLoading(true)
      await userService.updateProfile({
        username: user?.username,
        email: user?.email,
        firstname: user?.firstName,
        lastname: user?.lastName
      })
      Alert.alert(
        'Éxito',
        'Perfil actualizado correctamente'
      )
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        'Error al actualizar el perfil'
      Alert.alert('Error', message)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !user)
    return (
      <View
        style={[
          styles.container,
          { justifyContent: 'center', alignItems: 'center' }
        ]}
      >
        <ActivityIndicator
          size='large'
          color={colors.primary}
        />
      </View>
    )

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background }
      ]}
    >
      <Tabs.Screen
        options={{
          headerRight: () => (
            <TouchableOpacity
              onPress={handleSave}
              disabled={loading}
            >
              <Text
                style={{
                  color: loading
                    ? colors.textSecondary
                    : '#007AFF',
                  marginRight: 20,
                  fontWeight: '600'
                }}
              >
                {loading ? 'Guardando...' : 'Guardar'}
              </Text>
            </TouchableOpacity>
          )
        }}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Personal Information */}
        <View style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              { color: colors.text }
            ]}
          >
            Información Personal
          </Text>
          <View style={styles.formGroup}>
            <Input
              label='Usuario'
              value={user.username}
              onChangeText={(text) =>
                handleChange('username', text)
              }
              placeholder='Nombre de usuario'
              autoCapitalize='none'
            />
            <Input
              label='Nombre'
              value={user.firstName}
              onChangeText={(text) =>
                handleChange('firstName', text)
              }
              placeholder='Nombre'
            />
            <Input
              label='Apellido'
              value={user.lastName}
              onChangeText={(text) =>
                handleChange('lastName', text)
              }
              placeholder='Apellido'
            />
            <Input
              label='Correo Electrónico'
              value={user.email}
              onChangeText={(text) =>
                handleChange('email', text)
              }
              placeholder='Correo'
              keyboardType='email-address'
              autoCapitalize='none'
            />
          </View>
        </View>

        {/* Preferences */}
        <View style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              { color: colors.text }
            ]}
          >
            Preferencias
          </Text>

          <View style={styles.preferenceItem}>
            <View style={styles.preferenceInfo}>
              <Text
                style={[
                  styles.preferenceLabel,
                  { color: colors.text }
                ]}
              >
                Modo Oscuro
              </Text>
              <Text
                style={[
                  styles.preferenceDescription,
                  { color: colors.textSecondary }
                ]}
              >
                Cambiar entre tema claro y oscuro
              </Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={toggleTheme}
              trackColor={{
                false: '#E0E0E0',
                true: colors.primary
              }}
              thumbColor={'#fff'}
            />
          </View>
        </View>

        {/* Configuration */}
        <View style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              { color: colors.text }
            ]}
          >
            Configuración
          </Text>

          <TouchableOpacity
            style={[
              styles.configItem,
              { borderBottomColor: colors.border }
            ]}
            onPress={() => {
              router.push('/auth/recover')
            }}
          >
            <Text
              style={[
                styles.configLabel,
                { color: colors.text }
              ]}
            >
              Cambiar Contraseña
            </Text>
            <MaterialIcons
              name='chevron-right'
              size={24}
              color={colors.textSecondary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.configItem,
              { borderBottomColor: colors.border }
            ]}
            onPress={signOut}
          >
            <Text style={styles.logoutText}>
              Cerrar Sesión
            </Text>
            <MaterialIcons
              name='power-settings-new'
              size={24}
              color='#FF3B30'
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0'
  },
  backButton: {
    padding: 4
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000'
  },
  scrollView: {
    flex: 1
  },
  content: {
    padding: 20
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 30
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f0f0f0'
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#007AFF',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff'
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    marginBottom: 4
  },
  profileEmail: {
    fontSize: 14,
    color: '#666'
  },
  section: {
    marginBottom: 30
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 16
  },
  formGroup: {
    gap: 16
  },
  preferenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  preferenceInfo: {
    flex: 1,
    paddingRight: 16
  },
  preferenceLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4
  },
  preferenceDescription: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18
  },
  configItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0'
  },
  configLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500'
  },
  logoutText: {
    fontSize: 16,
    color: '#FF3B30',
    fontWeight: '500'
  }
})
