import { Sector } from './Sectors'
import { User } from './User'

interface AddReport {
  latitude: string
  longitude: string
  sectorId: string  
  description: string
  powerStatus: 'NO_POWER' | 'POWER'
  status: 'RECEIVED' | 'IN_PROGRESS' | 'RESOLVER'
  photoUrl: string
}

interface ReportModel {
  id: number
  createdAt: string
  updatedAt: string
  user: User
  sector: Sector
  description: string
  powerStatus: 'NO_POWER' | 'POWER'
  status: string
  photoUrl: string
  latitude: number
  longitude: number
}

export type { AddReport, ReportModel }
