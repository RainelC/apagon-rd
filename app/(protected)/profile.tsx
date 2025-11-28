import { Input } from '@components/Input'
import { AuthContext } from '@context/AuthContext'
import { MaterialIcons } from '@expo/vector-icons'
import { useContext, useState } from 'react'
import {
  ActivityIndicator,
  Image,
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
  
  const [name, setName] = useState(user ? `${user.firstName} ${user.lastName}` : '')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState(user?.email || '')
  
  const [notifications, setNotifications] = useState(true)
  const [sms, setSms] = useState(false)

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: `https://ui-avatars.com/api/?name=${name}&background=random` }}
              style={styles.avatar}
            />
            <TouchableOpacity style={styles.editIconContainer}>
              <MaterialIcons name="edit" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.profileName}>{name}</Text>
          <Text style={styles.profileEmail}>{email}</Text>
        </View>

        {/* Personal Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información Personal</Text>
          <View style={styles.formGroup}>
            <Input
              label="Nombre"
              value={name}
              onChangeText={setName}
              placeholder="Nombre Completo"
            />
            <Input
              label="Número de Teléfono"
              value={phone}
              onChangeText={setPhone}
              placeholder="Teléfono"
              keyboardType="phone-pad"
            />
            <Input
              label="Correo Electrónico"
              value={email}
              onChangeText={setEmail}
              placeholder="Correo"
              keyboardType="email-address"
            />
          </View>
        </View>

        {/* Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferencias</Text>
          
          <View style={styles.preferenceItem}>
            <View style={styles.preferenceInfo}>
              <Text style={styles.preferenceLabel}>Notificaciones</Text>
              <Text style={styles.preferenceDescription}>
                Recibir notificaciones sobre el estado de sus reportes
              </Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: '#E0E0E0', true: '#007AFF' }}
              thumbColor={'#fff'}
            />
          </View>

          <View style={styles.preferenceItem}>
            <View style={styles.preferenceInfo}>
              <Text style={styles.preferenceLabel}>SMS</Text>
              <Text style={styles.preferenceDescription}>
                Recibir actualizaciones importantes por SMS
              </Text>
            </View>
            <Switch
              value={sms}
              onValueChange={setSms}
              trackColor={{ false: '#E0E0E0', true: '#007AFF' }}
              thumbColor={'#fff'}
            />
          </View>
        </View>

        {/* Configuration */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Configuración</Text>
          
          <TouchableOpacity style={styles.configItem}>
            <Text style={styles.configLabel}>Cambiar Contraseña</Text>
            <MaterialIcons name="chevron-right" size={24} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.configItem}
            onPress={signOut}
          >
            <Text style={styles.logoutText}>Cerrar Sesión</Text>
            <MaterialIcons name="power-settings-new" size={24} color="#FF3B30" />
          </TouchableOpacity>
        </View>

        <View style={{ height: 20 }} />
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
