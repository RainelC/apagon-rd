import { axiosInstance } from '../api/apiClient'
import { Sector } from '../types/Sectors'
import { SectorUptimeResponse } from '../types/SectorStats'

enum Endpoint {
  SECTORS_GEOJSON = 'sectors',
  SECTOR_UPTIME = 'sectors/histories'
}

class MapService {
  static async getSectorsGeoJson(
    token: string
  ): Promise<Sector[]> {
    const response = await axiosInstance.get<Sector[]>(
      Endpoint.SECTORS_GEOJSON,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    return response.data.map((sector) => {
      const geojson = JSON.parse(
        sector.geojson as unknown as string
      )

      geojson.coordinates = geojson.coordinates[0].map(
        ([lng, lat]: [number, number]) => {
          return [lat, lng]
        }
      )

      return {
        ...sector,
        geojson: geojson
      }
    })
  }

  static async getSectorUptime(
    sectorId: number,
    start: string,
    end: string
  ): Promise<SectorUptimeResponse> {
    const response =
      await axiosInstance.get<SectorUptimeResponse>(
        `${Endpoint.SECTOR_UPTIME}/${sectorId}/uptime`,
        {
          data: {
            start,
            end
          }
        }
      )

    return response.data
  }
}

export { MapService }
