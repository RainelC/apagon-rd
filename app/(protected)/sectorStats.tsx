import { AuthContext } from '@context/AuthContext'
import { MapService } from '@services/mapService'
import { useLocalSearchParams } from 'expo-router'
import { useContext, useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { SectorUptimeResponse } from '../../src/types/SectorStats'
import { GoBackButton } from '@components/GoBackButton'

export default function SectorStats() {
  const auth = useContext(AuthContext)
  const { sectorId, sectorName } = useLocalSearchParams<{
    sectorId: string
    sectorName: string
  }>()

  const [stats, setStats] =
    useState<SectorUptimeResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSectorStats()
  }, [sectorId])

  const loadSectorStats = async () => {
    if (!auth?.token || !sectorId) return

    try {
      setLoading(true)

      // Calculate date range for last 30 days
      const end = new Date()
      const start = new Date()
      start.setDate(start.getDate() - 30)

      const startStr = start.toISOString().split('.')[0]
      const endStr = end.toISOString().split('.')[0]

      const data = await MapService.getSectorUptime(
        parseInt(sectorId),
        startStr,
        endStr
      )

      setStats(data)
    } catch (error) {
      console.error('Error loading sector stats:', error)
      Alert.alert(
        'Error',
        'No se pudieron cargar las estadísticas del sector'
      )
    } finally {
      setLoading(false)
    }
  }

  if (!auth || !auth.token) {
    return (
      <ActivityIndicator
        size='large'
        color='#0000ff'
      />
    )
  }

  return (
    <ScrollView style={styles.container}>
      <SafeAreaView
        style={styles.container}
        edges={['top']}
      />
        <View style={styles.header}>
         <GoBackButton />
          <Text style={styles.title}>Estadísticas</Text>
        <View style={{ width: 50 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.sectorName}>{sectorName}</Text>
        <Text style={styles.subtitle}>Últimos 30 días</Text>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator
              size='large'
              color='#007AFF'
            />
          </View>
        ) : stats ? (
          <>
            <View style={styles.statsCard}>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>
                  Tiempo con energía
                </Text>
                <Text
                  style={[
                    styles.statValue,
                    { color: '#34C759' }
                  ]}
                >
                  {stats.uptimePercentage.toFixed(2)}%
                </Text>
              </View>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${stats.uptimePercentage}%` }
                  ]}
                />
              </View>
            </View>

            <View style={styles.statsCard}>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>
                  Tiempo sin energía
                </Text>
                <Text
                  style={[
                    styles.statValue,
                    { color: '#FF3B30' }
                  ]}
                >
                  {stats.downtimePercentage.toFixed(2)}%
                </Text>
              </View>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFillRed,
                    {
                      width: `${stats.downtimePercentage}%`
                    }
                  ]}
                />
              </View>
            </View>

            <View style={styles.detailsCard}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>
                  Total de horas
                </Text>
                <Text style={styles.detailValue}>
                  {stats.totalHours.toFixed(2)} hrs
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>
                  Horas con energía
                </Text>
                <Text style={styles.detailValue}>
                  {stats.uptime.toFixed(2)} hrs
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>
                  Horas sin energía
                </Text>
                <Text style={styles.detailValue}>
                  {stats.downtime.toFixed(2)} hrs
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.refreshButton}
              onPress={loadSectorStats}
            >
              <Text style={styles.refreshButtonText}>
                Actualizar
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No hay datos disponibles
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0'
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000'
  },
  backButton: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600'
  },
  content: {
    padding: 20
  },
  sectorName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    marginBottom: 4
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 300
  },
  statsCard: {
    backgroundColor: '#F9F9F9',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0'
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  statLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500'
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700'
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#34C759',
    borderRadius: 4
  },
  progressFillRed: {
    height: '100%',
    backgroundColor: '#FF3B30',
    borderRadius: 4
  },
  detailsCard: {
    backgroundColor: '#F9F9F9',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0'
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500'
  },
  detailValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600'
  },
  refreshButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8
  },
  refreshButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200
  },
  emptyText: {
    fontSize: 16,
    color: '#666'
  }
})
