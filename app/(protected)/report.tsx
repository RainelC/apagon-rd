import ReportMap from '@components/ReportMap'
import {
  DARK_COLORS,
  LIGHT_COLORS
} from '@constants/colors'
import { useTheme } from '@context/ThemeContext'
import { Ionicons } from '@expo/vector-icons'
import { useForm } from '@hooks/useForm'
import * as ImagePicker from 'expo-image-picker'
import * as Location from 'expo-location'
import {
  router,
  useFocusEffect,
  useLocalSearchParams
} from 'expo-router'
import { useCallback, useRef, useState } from 'react'
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native'
import { AddReport } from '../../src/types/Report'

export default function Report() {
  const { isDarkMode } = useTheme()
  const colors = isDarkMode ? DARK_COLORS : LIGHT_COLORS

  const { lat, lng, sectorId } = useLocalSearchParams<{
    lat: string
    lng: string
    sectorId: string
  }>()

  const [loading, setLoading] = useState(false)
  const { form, setField, setFields, resetForm } =
    useForm<AddReport>({
      latitude: lat || '',
      longitude: lng || '',
      sectorId: sectorId || '',
      description: '',
      status: 'RECEIVED',
      powerStatus: 'POWER',
      photoUrl: ''
    })

  const setFieldsRef = useRef(setFields)
  setFieldsRef.current = setFields

  // Helper to get current location
  const getCurrentLocation = async () => {
    try {
      let { status } =
        await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        Alert.alert(
          'Error',
          'Permiso para acceder a la ubicación denegado'
        )
        return
      }

      let location = await Location.getCurrentPositionAsync(
        {}
      )
      setFieldsRef.current({
        latitude: location.coords.latitude.toFixed(5),
        longitude: location.coords.longitude.toFixed(5),
        sectorId: sectorId || ''
      })
    } catch {
      Alert.alert(
        'Error',
        'No se pudo obtener la ubicación actual'
      )
    }
  }

  // Handle location from params or get current location
  useFocusEffect(
    useCallback(() => {
      async function handleLocation() {
        if (lat && lng) {
          // If we have lat/lng from params, use them
          setFieldsRef.current({
            latitude: (+lat).toFixed(5),
            longitude: (+lng).toFixed(5),
            sectorId: sectorId || ''
          })
        } else {
          // Otherwise, get current location
          getCurrentLocation()
        }
      }

      handleLocation()

      return () => {
        resetForm()
      }
    }, [lat, lng])
  )

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
      console.log(form)
      // await ReportService.createReport(form)
      Alert.alert('Éxito', 'Reporte creado exitosamente', [
        {
          text: 'OK',
          onPress: () => {
            resetForm()
            getCurrentLocation()
            router.back()
          }
        }
      ])
    } catch (error: any) {
      Alert.alert('Error', error.response.data.message)
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

    if (result.canceled) return setField('photoUrl', '')
    setField('photoUrl', result.assets[0].uri)
  }

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: colors.background }
      ]}
    >
      <View style={styles.content}>
        <View style={styles.formGroup}>
          <Text
            style={[
              styles.label,
              styles.zeroMarginTop,
              { color: colors.text }
            ]}
          >
            Descripción
          </Text>
          <TextInput
            style={[
              styles.textarea,
              {
                backgroundColor: colors.inputBackground,
                color: colors.text
              }
            ]}
            placeholder='Describe la avería detalladamente...'
            placeholderTextColor={colors.secondary}
            value={form.description}
            onChangeText={(text) =>
              setField('description', text)
            }
            multiline
            numberOfLines={4}
          />
        </View>
        <View style={styles.formGroup}>
          <Text
            style={[styles.label, { color: colors.text }]}
          >
            Estado de la energía
          </Text>
          <View style={styles.selectContainer}>
            <TouchableOpacity
              style={[
                styles.selectOption,
                isDarkMode && { borderColor: '#444' },
                { backgroundColor: colors.inputBackground },
                form.powerStatus === 'POWER' && [
                  styles.selectOptionActive,
                  { backgroundColor: colors.primary }
                ]
              ]}
              onPress={() =>
                setField('powerStatus', 'POWER')
              }
            >
              <Text
                style={[
                  styles.selectOptionText,
                  { color: colors.textSecondary },
                  form.powerStatus === 'POWER' &&
                    styles.selectOptionTextActive
                ]}
              >
                Con luz
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.selectOption,
                isDarkMode && { borderColor: '#444' },
                { backgroundColor: colors.inputBackground },
                form.powerStatus === 'NO_POWER' && [
                  styles.selectOptionActive,
                  { backgroundColor: colors.primary }
                ]
              ]}
              onPress={() =>
                setField('powerStatus', 'NO_POWER')
              }
            >
              <Text
                style={[
                  styles.selectOptionText,
                  { color: colors.textSecondary },
                  form.powerStatus === 'NO_POWER' &&
                    styles.selectOptionTextActive
                ]}
              >
                Sin luz
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          onPress={pickImage}
          style={[
            styles.imagePicker,
            {
              backgroundColor: colors.inputBackground,
              borderColor: colors.text
            },
            form.photoUrl && {
              borderColor: colors.primary,
              backgroundColor: isDarkMode
                ? '#003366'
                : '#e0f7ff'
            }
          ]}
        >
          <Ionicons
            name='image-outline'
            size={24}
            color={colors.text}
          />
          <Text style={{ color: colors.text }}>
            Adjuntar fotos o video (opcional)
          </Text>
        </TouchableOpacity>

        <View>
          <ReportMap
            latitude={form.latitude}
            longitude={form.longitude}
            touchControl={false}
            canOpenInMaps={false}
            isDarkMode={isDarkMode}
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.submitButton,
              { backgroundColor: colors.primary },
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
  textarea: {
    minHeight: 120,
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 5,
    fontSize: 16
  },
  formGroup: {},
  zeroMarginTop: {
    marginTop: 0
  },
  label: {
    marginVertical: 15,
    fontSize: 16,
    fontWeight: '600'
  },
  coordinatesContainer: {
    flexDirection: 'row',
    gap: 10
  },
  coordinateInput: {
    flex: 1
  },
  selectContainer: {
    flexDirection: 'row',
    gap: 10
  },
  selectOption: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center'
  },
  selectOptionActive: {
    borderColor: '#007AFF'
  },
  selectOptionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333'
  },
  selectOptionTextActive: {
    color: '#fff'
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
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'row',
    gap: 10
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10
  },
  submitButton: {
    flex: 1,
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
