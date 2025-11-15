import { axiosInstance } from '../api/apiClient'
import { Sector } from '../types/Sectors'

enum Endpoint {
  SECTORS_GEOJSON = 'sectors'
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
}

export { MapService }
