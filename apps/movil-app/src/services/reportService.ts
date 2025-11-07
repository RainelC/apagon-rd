import { axiosInstance } from '../api/apiClient'
import { AddReport } from '../types/Report'

enum Endpoint {
  UPLOAD_IMAGE = 'files/upload',
  CREATE = 'reports'
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
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      )
      if (imageResponse.status !== 200)
        throw new Error('Error uploading image')

      console.log(imageResponse.data.uri)
      report.imageUri = imageResponse.data.uri
    }

    const response = await axiosInstance.post(
      Endpoint.CREATE,
      report,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    )

    if (response.status !== 200 && response.status !== 201)
      throw new Error('Error creating report')
    console.log(response.data)
    return response.data
  }
}

export { ReportService }
