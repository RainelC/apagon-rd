import { GoBackButton } from '@components/GoBackButton'
import { ImageViewer } from '@components/ImageViewer'
import ReportMap from '@components/ReportMap'
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
      <View style={styles.container}>
        <Text>Cargando reporte...</Text>
      </View>
    )
  }

  return (
    <SafeAreaView
      style={styles.container}
      edges={['top']}
    >
      <View style={styles.header}>
        <GoBackButton />
        <Text style={styles.headerTitle}>
          Reporte #{reportDetail.id}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Descripción
          </Text>
          <Text style={styles.descriptionText}>
            {reportDetail.description}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
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
            <Text style={styles.powerStatusText}>
              {reportDetail.powerStatus === 'POWER'
                ? 'Con luz'
                : 'Sin luz'}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fotos</Text>
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
            <Text style={styles.noDataText}>
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
          <Text style={styles.sectionTitle}>Ubicación</Text>
          <ReportMap
            latitude={reportDetail.latitude.toString()}
            longitude={reportDetail.longitude.toString()}
            touchControl={true}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
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
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: '#fff'
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
    borderRadius: 12,
    backgroundColor: '#f0f0f0'
  },
  noDataText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic'
  }
})
