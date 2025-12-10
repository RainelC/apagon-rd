import { GoBackButton } from '@components/GoBackButton'
import {
  DARK_COLORS,
  LIGHT_COLORS
} from '@constants/colors'
import { useTheme } from '@context/ThemeContext'
import {
  Ionicons,
  MaterialCommunityIcons
} from '@expo/vector-icons'
import { MapService } from '@services/mapService'
import { useLocalSearchParams } from 'expo-router'
import { useCallback, useEffect, useState } from 'react'
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
import { SectorUptimeHistory, SectorUptimeParams } from '../../src/types/Sectors'

export default function SectorStats() {
  const { sectorId } = useLocalSearchParams<{
    sectorId: string
  }>()

  const { isDarkMode } = useTheme()
  const colors = isDarkMode ? DARK_COLORS : LIGHT_COLORS

  const [stats, setStats] =
    useState<SectorUptimeHistory | null>(null)
  const [loading, setLoading] = useState(true)

const formatDateParam = (date: Date): string => {
    const pad = (value: number): string => value.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
};

const getCurrentMonthRange = (): SectorUptimeParams => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    start.setHours(0, 0, 0, 0);

    const end = new Date(now);
    end.setHours(23, 59, 59, 999);

    return {
        start: formatDateParam(start),
        end: formatDateParam(end)
    };
};


  const loadSectorStats = useCallback(async () => {
    if (!sectorId) return

    try {
      setLoading(true)

      const { start, end } = getCurrentMonthRange();

      const data = await MapService.getSectorUptime(
        parseInt(sectorId),
        {
          start,
          end
        }
      )

      setStats(data)
    } catch {
      Alert.alert(
        'Error',
        'No se pudieron cargar las estadísticas del sector'
      )
    } finally {
      setLoading(false)
    }
  }, [sectorId])

  useEffect(() => {
    loadSectorStats()
  }, [loadSectorStats, sectorId])

  // Calculate derived values
  const downtimeHours = stats
    ? stats.totalHours - stats.powerHours
    : 0
  const effectivePercentage = stats ? stats.percentage : 0
  const downtimePercentage = stats
    ? 100 - stats.percentage
    : 0

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView
        style={{ backgroundColor: colors.background }}
        edges={['top']}
      />
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <GoBackButton />
        <Text style={[styles.title, { color: colors.text }]}>Estadísticas</Text>
        <View style={{ width: 50 }} />
      </View>

      <View style={styles.content}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={[styles.pageTitle, { color: colors.textSecondary }]}>
            Estadísticas del sector
          </Text>
          <Text style={[styles.pageSubtitle, { color: colors.textSecondary }]}>
            Aquí te mostramos cuánto tiempo tu sector ha
            pasado sin energía este mes.
          </Text>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator
              size='large'
              color='#007AFF'
            />
          </View>
        ) : stats ? (
          <>
            {/* Sector Info Card */}
            <View style={[styles.sectorInfoCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
              <View style={styles.sectorInfoLeft}>
                <Text style={[styles.sectorLabel, { color: colors.text }]}>
                  SECTOR
                </Text>
                <Text style={[styles.sectorName, { color: colors.textSecondary }]}>
                  {stats.sector.name}
                </Text>
                <View style={[styles.statusBadge, { backgroundColor: colors.border }]}>
                  <Ionicons
                    name={
                      stats.sector.status === 'POWER'
                        ? 'flash'
                        : 'flash-off'
                    }
                    size={16}
                    color={
                      stats.sector.status === 'POWER'
                        ? '#34C759'
                        : '#FF3B30'
                    }
                  />
                  <Text
                    style={[
                      styles.statusText,
                      {
                        color:
                          stats.sector.status === 'POWER'
                            ? '#34C759'
                            : '#FF3B30'
                      }
                    ]}
                  >
                    {stats.sector.status === 'POWER'
                      ? 'Con luz'
                      : 'Sin luz'}
                  </Text>
                </View>
              </View>
              <View style={styles.sectorInfoRight}>
                <Text style={styles.periodLabel}>
                  {!stats.period ? stats.period : 'Período'}
                </Text>
                <Text style={styles.periodText}>
                  {stats.period}
                </Text>
              </View>
            </View>

            <View style={styles.statsGrid}>
              {/* Power time */}
              <View style={[styles.statCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
                <View style={styles.statCardContent}>
                  <View style={styles.statCardLeft}>
                    <Text style={styles.statCardLabel}>
                      Tiempo con energía
                    </Text>
                    <Text
                      style={[
                        styles.statCardValue,
                        { color: '#34C759' }
                      ]}
                    >
                      {effectivePercentage.toFixed(1)}%
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.statCardIcon,
                      { backgroundColor: colors.iconColorGreenBg }
                    ]}
                  >
                    <Ionicons
                      name='flash'
                      size={24}
                      color='#34C759'
                    />
                  </View>
                </View>
              </View>

              {/* Power hours */}
              <View style={[styles.statCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
                <View style={styles.statCardContent}>
                  <View style={styles.statCardLeft}>
                    <Text style={styles.statCardLabel}>
                      Horas con energía
                    </Text>
                    <Text
                      style={[
                        styles.statCardValue,
                        { color: '#007AFF' }
                      ]}
                    >
                      {stats.powerHours.toFixed(1)}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.statCardIcon,
                      { backgroundColor: colors.iconColorBlueBg }
                    ]}
                  >
                    <Ionicons
                      name='time'
                      size={24}
                      color='#007AFF'
                    />
                  </View>
                </View>
              </View>

              {/* Downtime hours */}
              <View style={[styles.statCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
                <View style={styles.statCardContent}>
                  <View style={styles.statCardLeft}>
                    <Text style={styles.statCardLabel}>
                      Horas sin energía
                    </Text>
                    <Text
                      style={[
                        styles.statCardValue,
                        { color: '#FF3B30' }
                      ]}
                    >
                      {downtimeHours.toFixed(1)}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.statCardIcon,
                      { backgroundColor: colors.iconColorRedBg }
                    ]}
                  >
                    <Ionicons
                      name='flash-off'
                      size={24}
                      color='#FF3B30'
                    />
                  </View>
                </View>
              </View>

              {/* Total hours */}
              <View style={[styles.statCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
                <View style={styles.statCardContent}>
                  <View style={styles.statCardLeft}>
                    <Text style={styles.statCardLabel}>
                      Total horas
                    </Text>
                    <Text
                      style={[
                        styles.statCardValue,
                        { color: '#666' }
                      ]}
                    >
                      {stats.totalHours.toFixed(1)}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.statCardIcon,
                      { backgroundColor: colors.iconColorWhiteBg }
                    ]}
                  >
                    <Ionicons
                      name='calendar'
                      size={24}
                      color='#666'
                    />
                  </View>
                </View>
              </View>
            </View>

            {/* Power percentage */}
            <View style={[styles.chartCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
              <Text style={[styles.chartTitle, { color: colors.text }]}>
                Proporción de energía
              </Text>
              <View style={styles.chartContent}>
                <View style={styles.progressBarLarge}>
                  <View
                    style={[
                      styles.progressFillLarge,
                      { width: `${effectivePercentage}%` }
                    ]}
                  />
                </View>
                <View style={styles.chartLegend}>
                  <View style={styles.legendItem}>
                    <View
                      style={[
                        styles.legendDot,
                        { backgroundColor: '#34C759' }
                      ]}
                    />
                    <Text style={styles.legendText}>
                      Con energía (
                      {effectivePercentage.toFixed(1)}%)
                    </Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View
                      style={[
                        styles.legendDot,
                        { backgroundColor: '#FF3B30' }
                      ]}
                    />
                    <Text style={styles.legendText}>
                      Sin energía (
                      {downtimePercentage.toFixed(1)}%)
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Summary of the month */}
            <View style={[styles.summaryCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
              <View style={styles.summaryHeader}>
                <MaterialCommunityIcons
                  name='calendar-month'
                  size={20}
                  color='#9C27B0'
                />
                <Text style={[styles.summaryTitle, { color: colors.text }]}>
                  Resumen del mes
                </Text>
              </View>
              <View style={styles.summaryContent}>
                <View
                  style={[
                    styles.summaryItem,
                    { backgroundColor: colors.iconColorRedBg }
                  ]}
                >
                  <View style={styles.summaryItemLeft}>
                    <Ionicons
                      name='flash-off'
                      size={18}
                      color='#FF3B30'
                    />
                    <Text style={[styles.summaryItemLabel, { color: colors.textSecondary }]}>
                      Días sin energía
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.summaryItemValue,
                      { color: '#C62828' }
                    ]}
                  >
                    {Math.round(
                      (downtimeHours / stats.totalHours) *
                        30
                    )}{' '}
                    días
                  </Text>
                </View>

                <View
                  style={[
                    styles.summaryItem,
                    {
                      backgroundColor:
                        effectivePercentage > 50
                          ? '#E8F5E9'
                          : '#E8EAF6'
                    }
                  ]}
                >
                  <View style={styles.summaryItemLeft}>
                    <MaterialCommunityIcons
                      name='percent'
                      size={18}
                      color={
                        effectivePercentage > 50
                          ? '#34C759'
                          : '#5E35B1'
                      }
                    />
                    <Text style={styles.summaryItemLabel}>
                      Eficiencia
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.summaryItemValue,
                      {
                        color:
                          effectivePercentage > 50
                            ? '#2E7D32'
                            : '#5E35B1'
                      }
                    ]}
                  >
                    {effectivePercentage.toFixed(2)}%
                  </Text>
                </View>

                <View
                  style={[
                    styles.summaryItem,
                    { backgroundColor: colors.iconColorRedBg }
                  ]}
                >
                  <View style={styles.summaryItemLeft}>
                    <Ionicons
                      name='flash-off'
                      size={18}
                      color='#FF3B30'
                    />
                    <Text style={[styles.summaryItemLabel, { color: colors.textSecondary }]}>
                      Promedio diario sin luz
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.summaryItemValue,
                      { color: '#C62828' }
                    ]}
                  >
                    {(downtimeHours / 30).toFixed(2)}{' '}
                    hrs/día
                  </Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.refreshButton,
                { backgroundColor: colors.primary }
              ]}
              onPress={loadSectorStats}
            >
              <Ionicons
                name='refresh'
                size={20}
                color='#fff'
              />
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  content: {
    padding: 20
  },
  headerSection: {
    marginBottom: 24
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8
  },
  pageSubtitle: {
    fontSize: 14,
    lineHeight: 20
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 300
  },
  sectorInfoCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E0E7FF',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  sectorInfoLeft: {
    flex: 1
  },
  sectorLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#666',
    letterSpacing: 1,
    marginBottom: 4
  },
  sectorName: {
    fontSize: 26,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    gap: 6
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600'
  },
  sectorInfoRight: {
    alignItems: 'flex-end'
  },
  periodLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4
  },
  periodText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333'
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20
  },
  statCard: {
    width: '48%',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1
  },
  statCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  statCardLeft: {
    flex: 1
  },
  statCardLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
    marginBottom: 6
  },
  statCardValue: {
    fontSize: 28,
    fontWeight: '700'
  },
  statCardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center'
  },
  chartCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16
  },
  chartContent: {
    gap: 16
  },
  progressBarLarge: {
    height: 24,
    backgroundColor: '#de0727ff',
    borderRadius: 12,
    overflow: 'hidden'
  },
  progressFillLarge: {
    height: '100%',
    backgroundColor: '#19a33bff',
    borderRadius: 12
  },
  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 12
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6
  },
  legendText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500'
  },
  summaryCard: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  summaryContent: {
    gap: 12
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8
  },
  summaryItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1
  },
  summaryItemLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  summaryItemValue: {
    fontSize: 16,
    fontWeight: '700'
  },
  refreshButton: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    flexDirection: 'row',
    gap: 8
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
