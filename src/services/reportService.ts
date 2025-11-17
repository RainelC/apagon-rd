import { axiosInstance } from '../api/apiClient'
import { AddReport, Report } from '../types/Report'

enum Endpoint {
  UPLOAD_IMAGE = 'files/upload',
  CREATE = 'reports',
  GET_ALL = 'reports'
}

class ReportService {
  static async createReport(
    token: string,
    report: AddReport
  ) {
    if (report.imageUri) {
      const formData = new FormData()

      formData.append('file', {
        uri: report.imageUri,
        type: 'image/*',
        name: 'report-image.jpg'
      })

      const imageResponse = await axiosInstance.post(
        'files/upload',
        formData
      )
      if (imageResponse.status !== 200)
        throw new Error('Error uploading image')

      report.imageUri = imageResponse.data.uri
    }

    const response = await axiosInstance.post(
      Endpoint.CREATE,
      report
    )

    if (response.status !== 200 && response.status !== 201)
      throw new Error('Error creating report')
    return response.data
  }

  static async getAllReports(
    userId: number,
    status?: string
  ): Promise<Report[]> {
    const params: any = { userId }
    if (status) {
      params.status = status
    }
    const response = await axiosInstance.get(
      Endpoint.GET_ALL,
      {
        params
      }
    )

    if (response.status !== 200)
      throw new Error('Error fetching reports')
    return response.data.content
  }
}

export { ReportService }
