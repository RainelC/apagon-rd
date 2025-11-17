import { StyleSheet, Text, View } from 'react-native'
import { Report } from '../types/Report'

interface ReportItemProps {
  report: Report
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
  const statusColor = getStatusColor(report.status)
  const statusText = getStatusText(report.status)
  const formattedDate = formatDate(report.createdAt)

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>
          {report.description}
        </Text>
        <Text style={styles.date}>{formattedDate}</Text>
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
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    shadowColor: '#000',
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
    color: '#000000',
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
