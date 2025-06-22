import {
  DashboardData,
  OverviewData,
  TicketsByStatus,
  ClientStats,
  ProductStats,
} from '@/types/dashboard.types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL
  ? process.env.NEXT_PUBLIC_API_BASE_URL + '/api'
  : 'http://localhost:5000/api'

class DashboardAPI {
  private async request<T>(endpoint: string): Promise<T> {
    try {
      const url = `${API_BASE_URL}/dashboard${endpoint}`

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ Error response:', errorText)
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`
        )
      }

      const data = await response.json()

      return data.data
    } catch (error) {
      console.error(`❌ Dashboard API error for ${endpoint}:`, error)
      throw error
    }
  }

  async getOverviewData(): Promise<OverviewData> {
    return this.request<OverviewData>('/overview')
  }

  async getTicketsByStatus(): Promise<TicketsByStatus> {
    return this.request<TicketsByStatus>('/tickets-by-status')
  }

  async getClientStats(): Promise<ClientStats> {
    return this.request<ClientStats>('/clients')
  }

  async getProductStats(): Promise<ProductStats> {
    return this.request<ProductStats>('/products')
  }

  async getAllDashboardData(): Promise<DashboardData> {
    return this.request<DashboardData>('/all')
  }
}

export const dashboardAPI = new DashboardAPI()
