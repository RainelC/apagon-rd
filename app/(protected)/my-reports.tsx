import { useFocusEffect } from 'expo-router'
import { useCallback, useContext, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import ReportItem from '../../src/components/report'
import { AuthContext } from '../../src/context/AuthContext'
import { ReportService } from '../../src/services/reportService'
import { ReportModel } from '../../src/types/Report'
import { decodeJWT, getUserIdFromToken } from '../../src/utils/jwtDecoder'

type FilterType = 'ACTIVE' | 'RESOLVER'

export default function MyReports() {
  const auth = useContext(AuthContext)
  const [reports, setReports] = useState<ReportModel[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] =
    useState<FilterType>('ACTIVE')

  useFocusEffect(
    useCallback(() => {
      if (auth?.token) {
        loadReports()
      }
    }, [auth?.token, activeFilter])
  )

  const loadReports = async () => {
    if (!auth?.token) return
    try {
      setLoading(true)
      const userId = getUserIdFromToken(auth.token)

      if (!userId) {
        Alert.alert(
          'Error',
          'No se pudo obtener el ID de usuario'
        )
        return
      }

      // Map filter to status
      let status: string | undefined
      if (activeFilter === 'ACTIVE') {
        status = '' // Fetch all
      } else if (activeFilter === 'RESOLVER') {
        status = 'RESOLVER'
      }

      const fetchedReports =
        await ReportService.getAllReports(userId, status)

      // Filter for active reports if needed
      if (activeFilter === 'ACTIVE') {
        const activeReports = fetchedReports.filter(
          (r) => r.status.toUpperCase() !== 'RESOLVER'
        )
        setReports(activeReports)
      } else {
        setReports(fetchedReports)
      }
    } catch (error) {
      console.error('Error loading reports:', error)
      Alert.alert(
        'Error',
        'No se pudieron cargar los reportes'
      )
    } finally {
      setLoading(false)
    }
  }
  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterTab,
            activeFilter === 'ACTIVE' &&
              styles.filterTabActive
          ]}
          onPress={() => setActiveFilter('ACTIVE')}
        >
          <Text
            style={[
              styles.filterText,
              activeFilter === 'ACTIVE' &&
                styles.filterTextActive
            ]}
          >
            Activos
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterTab,
            activeFilter === 'RESOLVER' &&
              styles.filterTabActive
          ]}
          onPress={() => setActiveFilter('RESOLVER')}
        >
          <Text
            style={[
              styles.filterText,
              activeFilter === 'RESOLVER' &&
                styles.filterTextActive
            ]}
          >
            Resueltos
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size='large'
            color='#007AFF'
          />
        </View>
      ) : reports.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            No hay reportes{' '}
            {activeFilter === 'ACTIVE'
              ? 'activos'
              : 'resueltos'}
          </Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          {reports.map((report) => (
            <ReportItem
              key={report.id}
              report={report}
            />
          ))}
        </ScrollView>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5'
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0'
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000'
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0'
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center'
  },
  filterTabActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF'
  },
  filterText: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '500'
  },
  filterTextActive: {
    color: '#007AFF',
    fontWeight: '600'
  },
  scrollView: {
    flex: 1
  },
  scrollContent: {
    paddingVertical: 8
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyText: {
    fontSize: 16,
    color: '#666666'
  }
})
