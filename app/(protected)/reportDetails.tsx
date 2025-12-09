import { GoBackButton } from '@components/GoBackButton'
import { ImageViewer } from '@components/ImageViewer'
import ReportMap from '@components/ReportMap'
import {
  DARK_COLORS,
  LIGHT_COLORS
} from '@constants/colors'
import { useTheme } from '@context/ThemeContext'
import { useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ReportModel } from '../../src/types/Report'

export default function ReportDetails() {
  const { reportDetail: reportDetailParam } =
    useLocalSearchParams<{
      reportDetail: string
    }>()
  const { isDarkMode } = useTheme()
  const colors = isDarkMode ? DARK_COLORS : LIGHT_COLORS
  const [reportDetail, setReportDetail] =
    useState<ReportModel | null>(null)
  const [imageModalVisible, setImageModalVisible] =
    useState(false)

  useEffect(() => {
    if (reportDetailParam) {
      try {
        const parsedReport = JSON.parse(reportDetailParam)
        setReportDetail(parsedReport)
      } catch {
        Alert.alert(
          'Error',
          'No se pudo cargar el detalle del reporte'
        )
      }
    }
  }, [reportDetailParam])

  const openImage = () => {
    setImageModalVisible(true)
  }

  const closeImage = () => {
    setImageModalVisible(false)
  }

  if (!reportDetail) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: colors.background }
        ]}
      >
        <Text style={{ color: colors.text }}>
          Cargando reporte...
        </Text>
      </View>
    )
  }

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: colors.background }
      ]}
      edges={['top']}
    >
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.background,
            borderBottomColor: colors.border
          }
        ]}
      >
        <GoBackButton />
        <Text
          style={[
            styles.headerTitle,
            { color: colors.text }
          ]}
        >
          Reporte #{reportDetail.id}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              { color: colors.text }
            ]}
          >
            Descripción
          </Text>
          <Text
            style={[
              styles.descriptionText,
              { color: colors.textSecondary }
            ]}
          >
            {reportDetail.description}
          </Text>
        </View>

        <View style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              { color: colors.text }
            ]}
          >
            Estado de la energía
          </Text>
          <View style={styles.powerStatusContainer}>
            <View
              style={[
                styles.powerStatusDot,
                {
                  backgroundColor:
                    reportDetail.powerStatus === 'POWER'
                      ? '#34C759'
                      : '#FF3B30'
                }
              ]}
            />
            <Text
              style={[
                styles.powerStatusText,
                { color: colors.text }
              ]}
            >
              {reportDetail.powerStatus === 'POWER'
                ? 'Con luz'
                : 'Sin luz'}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              { color: colors.text }
            ]}
          >
            Fotos
          </Text>
          {reportDetail.photoUrl ? (
            <View style={styles.photosContainer}>
              <TouchableOpacity
                onPress={openImage}
                style={styles.photo}
              >
                <Image
                  source={{ uri: reportDetail.photoUrl }}
                  resizeMode='cover'
                  style={styles.photo}
                />
              </TouchableOpacity>
            </View>
          ) : (
            <Text
              style={[
                styles.noDataText,
                { color: colors.textSecondary }
              ]}
            >
              No hay fotos adjuntas
            </Text>
          )}
        </View>
        <ImageViewer
          visible={imageModalVisible}
          onClose={closeImage}
          imageUrl={reportDetail?.photoUrl}
        />
        <View style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              { color: colors.text }
            ]}
          >
            Ubicación
          </Text>
          <ReportMap
            latitude={reportDetail.latitude.toString()}
            longitude={reportDetail.longitude.toString()}
            touchControl={true}
            canOpenInMaps={true}
            isDarkMode={isDarkMode}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1
  },
  backButton: {
    padding: 4
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333'
  },
  content: {
    flex: 1
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40
  },
  section: {
    marginBottom: 24
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12
  },
  descriptionText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24
  },
  powerStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  powerStatusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8
  },
  powerStatusText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500'
  },
  photosContainer: {
    flexDirection: 'row',
    gap: 12
  },
  photo: {
    width: '100%',
    height: 200,
    borderRadius: 12
  },
  noDataText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic'
  }
})
