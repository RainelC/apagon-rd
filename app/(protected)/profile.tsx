import { Input } from '@components/Input'
import {
  DARK_COLORS,
  LIGHT_COLORS
} from '@constants/colors'
import { AuthContext } from '@context/AuthContext'
import { useTheme } from '@context/ThemeContext'
import { MaterialIcons } from '@expo/vector-icons'
import { useContext, useState } from 'react'
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View
} from 'react-native'

export default function Profile() {
  const auth = useContext(AuthContext)
  if (!auth)
    return (
      <ActivityIndicator
        size='large'
        color='#0000ff'
      />
    )

  const { user, signOut } = auth
  const { isDarkMode, toggleTheme } = useTheme()
  const colors = isDarkMode ? DARK_COLORS : LIGHT_COLORS

  const [name, setName] = useState(
    user ? `${user.firstName} ${user.lastName}` : ''
  )
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState(user?.email || '')

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background }
      ]}
    >
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
              label='Nombre'
              value={name}
              onChangeText={setName}
              placeholder='Nombre Completo'
            />
            <Input
              label='Número de Teléfono'
              value={phone}
              onChangeText={setPhone}
              placeholder='Teléfono'
              keyboardType='phone-pad'
            />
            <Input
              label='Correo Electrónico'
              value={email}
              onChangeText={setEmail}
              placeholder='Correo'
              keyboardType='email-address'
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
