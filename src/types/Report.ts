import { Sector } from './Sectors'
import { User } from './User'

interface AddReport {
  latitude: string
  longitude: string
  sectorId: 1
  outageType: 'General Outage'
  description: string
  status: 'RECEIVED' | 'IN_PROGRESS' | 'RESOLVED'
  imageUri: string
}

interface Report {
  id: number
  createdAt: string
  updatedAt: string
  user: User
  sector: Sector
  description: string
  outageType: string
  status: string
  photoUrl: string
  latitude: number
  longitude: number
}

export type { AddReport, Report }
