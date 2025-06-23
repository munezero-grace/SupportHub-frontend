import { DashboardData } from '@/types/dashboard.types'
import axiosInstance from '@/services/axiosInstance'

class DashboardAPI {
  async getAllDashboardData(): Promise<DashboardData> {
    const response = await axiosInstance.get('/api/dashboard/all')
    const res = response.data
    return res.data
  }
}

export const dashboardAPI = new DashboardAPI()