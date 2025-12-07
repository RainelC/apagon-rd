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

interface SectorUptimeHistory {
    sector: Sector;
    start: string;
    end: string;
    percentage: number;
    powerHours: number;
    totalHours: number;
    powerMinutes: number;
    totalMinutes: number;
    period?: string | null;
}

interface SectorUptimeParams {
  start: string
  end: string
}

export type { Sector, SectorUptimeHistory, SectorUptimeParams }