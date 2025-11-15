import * as ImagePicker from 'expo-image-picker'
import { useForm } from '@hooks/useForm'
import {
  useLocalSearchParams,
  router,
  useFocusEffect
} from 'expo-router'
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Alert,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native'
import { AddReport } from '../../src/types/Report'
import {
  useCallback,
  useContext,
  useRef,
  useState
} from 'react'
import { Input } from '@components/Input'
import { COLORS } from '@constants/colors'
import { ReportService } from '@services/reportService'
import { AuthContext } from '@context/AuthContext'

export default function Report() {
  const auth = useContext(AuthContext)

  const { lat, lng } = useLocalSearchParams<{
    lat: string
    lng: string
  }>()

  const [loading, setLoading] = useState(false)

  const { form, setField, setFields, errors, resetForm } =
    useForm<AddReport>({
      latitude: lat || '',
      longitude: lng || '',
      sectorId: 1,
      outageType: 'General Outage',
      description: '',
      status: 'RECEIVED',
      imageUri: ''
    })

  const setFieldsRef = useRef(setFields)
  setFieldsRef.current = setFields

  useFocusEffect(
    useCallback(() => {
      setFieldsRef.current({
        latitude: lat ? (+lat).toFixed(5) : '',
        longitude: lng ? (+lng).toFixed(5) : ''
      })
    }, [lat, lng])
  )

  if (!auth || !auth.token)
    return (
      <ActivityIndicator
        size='large'
        color='#0000ff'
      />
    )

  const { token } = auth

  const handleSubmit = async () => {
    if (!form.description.trim()) {
      Alert.alert('Error', 'La descripción es requerida')
      return
    }

    if (!form.latitude || !form.longitude) {
      Alert.alert('Error', 'Las coordenadas son requeridas')
      return
    }

    try {
      setLoading(true)
      await ReportService.createReport(token, form)
      Alert.alert('Éxito', 'Reporte creado exitosamente', [
        {
          text: 'OK',
          onPress: () => {
            resetForm()
            router.back()
          }
        }
      ])
    } catch (error) {
      console.log(error)
      Alert.alert('Error', 'No se pudo crear el reporte')
    } finally {
      setLoading(false)
    }
  }

  const pickImage = async () => {
    const result =
      await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images', 'videos'],
        allowsEditing: true,
        quality: 1
      })

    if (result.canceled) return setField('imageUri', '')
    setField('imageUri', result.assets[0].uri)
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Ubicación</Text>
          <View style={styles.coordinatesContainer}>
            <View style={styles.coordinateInput}>
              <Input
                label='Latitud'
                placeholder='Ej: 18.4861'
                value={form.latitude}
                onChangeText={(text) =>
                  setField('latitude', text)
                }
                keyboardType='decimal-pad'
                error={errors.latitude}
              />
            </View>
            <View style={styles.coordinateInput}>
              <Input
                label='Longitud'
                placeholder='Ej: -69.9312'
                value={form.longitude}
                onChangeText={(text) =>
                  setField('longitude', text)
                }
                keyboardType='decimal-pad'
                error={errors.longitude}
              />
            </View>
          </View>
        </View>

        <View style={styles.formGroup}>
          <Input
            label='Descripción'
            placeholder='Describe la situación del apagón'
            value={form.description}
            onChangeText={(text) =>
              setField('description', text)
            }
            multiline
            numberOfLines={4}
            error={errors.description}
          />
        </View>

        <TouchableOpacity
          onPress={pickImage}
          style={[
            styles.imagePicker,
            form.imageUri && {
              borderColor: COLORS.primary,
              backgroundColor: '#e0f7ff'
            }
          ]}
        >
          <Text>Seleccionar imagen o video (opcional)</Text>
        </TouchableOpacity>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Text style={styles.cancelButtonText}>
              Cancelar
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.submitButton,
              loading && styles.submitButtonDisabled
            ]}
            onPress={handleSubmit}
            disabled={loading}
            activeOpacity={0.7}
          >
            <Text style={styles.submitButtonText}>
              {loading ? 'Enviando...' : 'Enviar Reporte'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  content: {
    padding: 20
  },
  formGroup: {},
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333'
  },
  coordinatesContainer: {
    flexDirection: 'row',
    gap: 10
  },
  coordinateInput: {
    flex: 1
  },
  imagePicker: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#333',
    marginTop: 15,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 10
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ddd'
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600'
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  submitButtonDisabled: {
    backgroundColor: '#a0c4ff',
    opacity: 0.7
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  }
})
