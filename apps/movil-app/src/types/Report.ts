interface AddReport {
  latitude: string
  longitude: string
  sectorId: 1
  outageType: 'General Outage'
  description: string
  status: 'RECEIVED' | 'IN_PROGRESS' | 'RESOLVED'
  imageUri: string
}

export type { AddReport }
