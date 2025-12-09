import { useRouter } from 'expo-router'
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { ReportModel } from '../types/Report'
import { useTheme } from '@context/ThemeContext'
import { DARK_COLORS, LIGHT_COLORS } from '@constants/colors'

interface ReportItemProps {
  report: ReportModel
}

const getStatusColor = (status: string): string => {
  switch (status.toUpperCase()) {
    case 'RECEIVED':
      return '#007AFF' // Blue
    case 'IN_PROGRESS':
      return '#FF9500' // Orange
    case 'RESOLVED':
      return '#34C759' // Green
    default:
      return '#666666' // Gray
  }
}

const getStatusText = (status: string): string => {
  switch (status.toUpperCase()) {
    case 'RECEIVED':
      return 'Recibido'
    case 'IN_PROGRESS':
      return 'En Progreso'
    case 'RESOLVED':
      return 'Resuelto'
    default:
      return status
  }
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  const months = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre'
  ]
  const day = date.getDate()
  const month = months[date.getMonth()]
  const year = date.getFullYear()
  return `${day} de ${month}, ${year}`
}

export default function ReportItem({
  report
}: ReportItemProps) {
  const router = useRouter()
  const statusColor = getStatusColor(report.status)
  const statusText = getStatusText(report.status)
  const formattedDate = formatDate(report.createdAt)

  const {isDarkMode} = useTheme()
  const colors = isDarkMode ? DARK_COLORS : LIGHT_COLORS

  const handlePress = () => {
    router.push({
      pathname: '/(protected)/reportDetails',
      params: { reportDetail: JSON.stringify(report) }
    })
  }

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.cardBackground }]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View>
        <Text style={[styles.title, { color: colors.text }]}>
          {report.description}
        </Text>
        <Text style={[styles.date, { color: colors.textSecondary }]}>
          {formattedDate}
        </Text>
      </View>
      <View style={styles.statusContainer}>
        <View
          style={[
            styles.statusDot,
            { backgroundColor: statusColor }
          ]}
        />
        <Text
          style={[
            styles.statusText,
            { color: statusColor }
          ]}
        >
          {statusText}
        </Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8
  },
  date: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500'
  }
})
