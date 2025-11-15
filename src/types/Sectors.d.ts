interface Sector {
  id: number
  createdAt: string
  updatedAt: string
  name: string
  status: 'NO_POWER' | 'POWER'
  lastUpdated: string
  geojson: Geojson
}

interface Geojson  {
  type: string
  coordinates: any[]
}

export type { Sector }
