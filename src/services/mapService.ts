import { axiosInstance } from '../api/apiClient'
import { Sector } from '../types/Sectors'
import { SectorUptimeHistory, SectorUptimeParams } from '../types/Sectors'

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


  static async getCurrentSector(
    lat: number,
    lon: number
  ): Promise<Sector> {
    const response = await axiosInstance.get<Sector>(
      `${Endpoint.SECTORS_GEOJSON}/current`,
      {
        params: {
          lat,
          lon
        }
      }
    )

    return response.data
  };

  static async getSectorUptime(
    sectorId: number,
    params: SectorUptimeParams
  ): Promise<SectorUptimeHistory> {
    const response =
      await axiosInstance.get<SectorUptimeHistory>(
        `${Endpoint.SECTOR_UPTIME}/${sectorId}/uptime`, {params});

    return response.data
  }
}

export { MapService }
